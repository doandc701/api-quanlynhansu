import Timekeeping from "../models/timekeeping.model.js";
import moment from "moment";

async function LIST_TIMEKEEPING(req, res) {
  const { page, limit, sorts, search, filters } = req.query;

  const query = {};
  if (filters.year) {
    query.year = filters.year;
  }
  if (filters.month) {
    query["employees.date_timekeeping"] = {
      $gte: `${filters.year}-${filters.month.padStart(2, "0")}-01`,
      $lt: `${filters.year}-${(parseInt(filters.month) + 1)
        .toString()
        .padStart(2, "0")}-01`,
    };
  }

  // if (filters.code) {
  //   query["employees.employee.code"] = filters.code;
  // }

  const countRecord = await Timekeeping.countDocuments().catch(() => {});

  const result = await Timekeeping.find(query)
    .sort(sorts)
    .skip((page - 1) * limit)
    .limit(limit);

  result.forEach((item) => {
    if (filters.code) {
      const filterJs = item.employees.filter(
        (el) => el.employee.code === filters.code
      );
      item.employees = filterJs;
    }
    if (search) {
      const searchJs = item.employees.filter(
        (el) => el.date_timekeeping === search.date_timekeeping
      );
      item.employees = searchJs;
    }
  });

  return res.status(200).json({
    data: result,
    current_page: Number(page),
    limit: Number(limit),
    total: countRecord,
  });
}

async function GET_TIMEKEEPING(req, res) {
  const recordTimekeeping = await Timekeeping.findOne({
    code: req.params.code,
  }).catch(() => {});
  res.status(200).json({
    data: recordTimekeeping,
  });
}

async function POST_TIMEKEEPING_CHECK_IN(req, res) {
  try {
    // check ngày hiện tại với ngày chấm
    const getCurrentDate = moment().format("YYYY-MM-DD");
    if (req.body.employees.date_timekeeping !== getCurrentDate) {
      res.status(400).json({ message: "Ngày check in không hợp lệ!" });
      return;
    }

    // check thứ 7 chủ nhật
    const dateTimeKeeping = moment(req.body.employees.date_timekeeping);
    if (dateTimeKeeping.day() === 0 || dateTimeKeeping.day() === 6) {
      res.status(400).json({ message: "Ngày check in không hợp lệ!" });
      return;
    }

    // check chấm công trong khung giờ
    const dateInUTC = moment.utc();
    const dateInGMTPlus7 = dateInUTC.clone().utcOffset("+07:00");
    const getCurrentHour = dateInGMTPlus7.hour();
    const getCurrentMinutes = moment().minutes();
    if (getCurrentHour < 8 || getCurrentHour > 17) {
      res.status(400).json({ message: "Giờ check in không hợp lệ!" });
      return;
    }

    if (getCurrentHour === 17 && getCurrentMinutes > 15) {
      res.status(400).json({ message: "Giờ check in không hợp lệ!" });
      return;
    }

    const existingRecord = await Timekeeping.findOne({ year: req.body.year });
    let workdayCheckIn = 0;
    if (existingRecord) {
      const findDoneTimeKeeping = existingRecord.employees.filter(
        (item) => item.date_timekeeping === req.body.employees.date_timekeeping
      );
      const hasNv = findDoneTimeKeeping.some(
        (item) => item.employee.code === req.body.employees.employee.code
      );
      if (hasNv) {
        res.status(400).json({ message: "Đã check in trong ngày hôm nay" });
        return;
      }
      let obj = { ...req.body.employees, workday: workdayCheckIn };
      existingRecord.employees.push(obj);
      await existingRecord.save();
      res.status(200).json(existingRecord);
    } else {
      const newRecord = new Timekeeping();
      let obj = { ...req.body.employees, workday: workdayCheckIn };
      newRecord.year = req.body.year;
      newRecord.employees = obj;
      await newRecord.save();
      res.status(200).json({ message: "Check in thành công" });
    }
  } catch (error) {
    res.status(401).json({ message: error });
  }
}
async function POST_TIMEKEEPING_CHECK_OUT(req, res) {
  try {
    // check ngày hiện tại với ngày chấm
    const getCurrentDate = moment().format("YYYY-MM-DD");
    if (req.body.employees.date_timekeeping !== getCurrentDate) {
      res.status(400).json({ message: "Ngày check out không hợp lệ!" });
      return;
    }

    // check thứ 7 chủ nhật
    const dateTimeKeeping = moment(req.body.employees.date_timekeeping);
    if (dateTimeKeeping.day() === 0 || dateTimeKeeping.day() === 6) {
      res.status(400).json({ message: "Ngày check out không hợp lệ!" });
      return;
    }

    // check chấm công trong khung giờ
    const dateInUTC = moment.utc();
    const dateInGMTPlus7 = dateInUTC.clone().utcOffset("+07:00");
    const getCurrentHour = dateInGMTPlus7.hour();
    const getCurrentMinutes = moment().minutes();
    if (getCurrentHour < 8 || getCurrentHour > 17) {
      res.status(400).json({ message: "Giờ check out không hợp lệ!" });
      return;
    }

    if (getCurrentHour === 17 && getCurrentMinutes > 15) {
      res.status(400).json({ message: "Giờ check out không hợp lệ!" });
      return;
    }

    let workdayCheckOut = 0;
    const existingRecord = await Timekeeping.findOne({
      year: req.body.year,
    });
    const hasDate = existingRecord.employees.filter(
      (item) => item.date_timekeeping === req.body.employees.date_timekeeping
    );
    // kiểm tra tất cả nhiên viên xem đã check in chưa ?
    if (hasDate.length) {
      let hasNv = hasDate.find(
        (item) => item.employee.code === req.body.employees.employee.code
      );
      // kiểm tra nhân viên đã check in chưa ?
      if (!hasNv) {
        res.status(400).json({ message: "Bạn chưa check in ngày hôm nay" });
        return;
      }

      if (hasNv.end_time) {
        res.status(400).json({ message: "Bạn đã check out ngày hôm nay" });
        return;
      }
      hasNv.end_time = req.body.employees.end_time;
      const startTime = moment(hasNv.start_time, "HH:mm");
      const endTime = moment(hasNv.end_time, "HH:mm");
      // Tính hiệu giữa hai thời điểm
      const duration = moment.duration(endTime.diff(startTime));
      // Lấy số giờ và phút từ đối tượng Duration
      const hours = duration.hours();
      const minutes = duration.minutes();
      // Tính tổng số giờ
      const totalHours = hours + minutes / 60;
      if (totalHours >= 5.15) {
        // tính thời gian nghỉ trưa
        const lunchBreakDuration = moment.duration({ hours: 1, minutes: 15 });
        const workingTime =
          endTime.diff(startTime) - lunchBreakDuration.asMilliseconds();
        const workingHours = moment.duration(workingTime).asHours();

        if (workingHours >= 4 && workingHours < 8) {
          workdayCheckOut = 0.5;
        } else if (workingHours === 8) {
          workdayCheckOut = 1;
        }
      }
      hasNv.workday = workdayCheckOut;
    } else {
      res.status(400).json({ message: "Bạn cần check in ngày hôm nay" });
      return;
    }
    await existingRecord.save();
    res.status(200).json({ message: "Check out thành công" });
  } catch (error) {
    res.status(401).json({ message: error });
  }
}

function PUT_TIMEKEEPING(req, res) {
  Timekeeping.updateOne({ code: req.params.code }, { $set: req.body })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(401).json({ message: error });
    });
}

async function DELETE_TIMEKEEPING(req, res) {
  const recordTimeKeeping = await Timekeeping.findOne({
    year: moment().year(),
    "employees.employee.code": req.params.code,
  });
  let idxRecordDelete = recordTimeKeeping.employees.findIndex(
    (item) => item.employee.code === req.params.code
  );
  recordTimeKeeping.employees.splice(idxRecordDelete, 1);
  await recordTimeKeeping.save();
  res.status(200).json({ message: "Xóa thành công" });
}

export {
  LIST_TIMEKEEPING,
  GET_TIMEKEEPING,
  POST_TIMEKEEPING_CHECK_IN,
  POST_TIMEKEEPING_CHECK_OUT,
  PUT_TIMEKEEPING,
  DELETE_TIMEKEEPING,
};
