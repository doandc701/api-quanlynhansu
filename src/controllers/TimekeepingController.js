import Timekeeping from "../models/timekeeping.model.js";
import moment from "moment";

async function LIST_TIMEKEEPING(req, res) {
  const { page, limit, sorts, search, filters } = req.query;
  const countRecord = await Timekeeping.countDocuments().catch(() => {});

  const result = await Timekeeping.find()
    .sort(sorts)
    .skip((page - 1) * limit)
    .limit(limit);

  result.forEach((item) => {
    if (item.year === filters.year) {
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

async function POST_TIMEKEEPING(req, res) {
  try {
    // check ngày hiện tại với ngày chấm
    const getCurrentDate = moment().format("YYYY-MM-DD");
    if (req.body.employees.date_timekeeping !== getCurrentDate) {
      res.status(400).json({ message: "Ngày chấm công không hợp lệ!" });
      return;
    }

    // check thứ 7 chủ nhật
    const dateTimeKeeping = moment(req.body.employees.date_timekeeping);
    if (dateTimeKeeping.day() === 0 || dateTimeKeeping.day() === 6) {
      res.status(400).json({ message: "Ngày chấm công không hợp lệ!" });
      return;
    }

    // check chấm công trong khung giờ
    const getCurrentHour = moment().hour();
    const getCurrentMinutes = moment().minutes();
    if (getCurrentHour < 8 || getCurrentHour > 17) {
      res.status(400).json({ message: "Giờ chấm công không hợp lệ!" });
      return;
    }

    if (getCurrentHour === 17 && getCurrentMinutes > 15) {
      res.status(400).json({ message: "Giờ chấm công không hợp lệ!" });
      return;
    }

    const existingRecord = await Timekeeping.findOne({ year: req.body.year });
    let workday = 0;
    const startTime = moment(req.body.employees.start_time, "HH:mm");
    const endTime = moment(req.body.employees.end_time, "HH:mm");
    const lunchBreakDuration = moment.duration({ hours: 1, minutes: 15 });
    const workingTime =
      endTime.diff(startTime) - lunchBreakDuration.asMilliseconds();
    const workingHours = moment.duration(workingTime).asHours();

    if (workingHours >= 4 && workingHours < 8) {
      workday = 0.5;
    } else if (workingHours === 8) {
      workday = 1;
    }

    if (existingRecord) {
      const findDoneTimeKeeping = existingRecord.employees.filter(
        (item) => item.date_timekeeping === req.body.employees.date_timekeeping
      );
      const hasNv = findDoneTimeKeeping.some(
        (item) => item.employee.code === req.body.employees.employee.code
      );
      if (hasNv) {
        res.status(400).json({ message: "Đã chấm công trong ngày hôm nay" });
        return;
      }
      let obj = { ...req.body.employees, workday };
      existingRecord.employees.push(obj);
      await existingRecord.save();
      res.status(200).json(existingRecord);
    } else {
      const newRecord = new Timekeeping();
      let obj = { ...req.body.employees, workday };
      newRecord.year = req.body.year;
      newRecord.employees = obj;
      await newRecord.save();
      res.status(200).json(newRecord);
    }
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
  await Timekeeping.deleteOne({ code: req.params.code })
    .then((deleted) => {
      res.status(200).json(deleted);
    })
    .catch((error) => {
      res.status(401).json({ message: error });
    });
}

export {
  LIST_TIMEKEEPING,
  GET_TIMEKEEPING,
  POST_TIMEKEEPING,
  PUT_TIMEKEEPING,
  DELETE_TIMEKEEPING,
};
