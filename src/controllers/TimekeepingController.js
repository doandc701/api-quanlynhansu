import Timekeeping from "../models/timekeeping.model.js";
import moment from "moment";

async function LIST_TIMEKEEPING(req, res) {
  const newQuery = req.query;
  const searchCondition = {};
  const countRecord = await Timekeeping.countDocuments().catch(() => {});
  if (newQuery) {
    const skip =
      Number(newQuery.page) * Number(newQuery.limit) - Number(newQuery.limit);
    let query = Timekeeping.find();
    if (newQuery.sorts) {
      if (Object.keys(newQuery.sorts).length > 0) {
        query = query.sort(newQuery.sorts);
      }
    }

    if (newQuery.search && Object.keys(newQuery.search).length > 0) {
      const search = {
        "employees.date_timekeeping": newQuery.search["date_timekeeping"],
      };
      query.find({ $text: { $search: search } });
    }

    if (newQuery.filters) {
      if (newQuery.filters.code) {
        query = Timekeeping.find({
          "employees.employee.code": newQuery.filters.code,
          year: newQuery.filters.year,
        });
      }
    }

    const results = await query
      .skip(skip)
      .limit(newQuery.limit)
      .catch(() => {});

    return res.status(200).json({
      data: results,
      current_page: Number(newQuery.page),
      limit: Number(newQuery.limit),
      total: countRecord,
    });
  }
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
    const existingRecord = await Timekeeping.findOne({ year: req.body.year });
    let workday = 0;
    const startTime = moment(req.body.employees.start_time, "HH:mm");
    const endTime = moment(req.body.employees.end_time, "HH:mm");
    // Thời gian nghỉ trưa là 1 giờ và 15 phút
    const lunchBreakDuration = moment.duration({ hours: 1, minutes: 15 });
    // Áp dụng thời gian nghỉ trưa để tính thời gian thực làm việc
    const workingTime =
      endTime.diff(startTime) - lunchBreakDuration.asMilliseconds();
    // Tính số giờ làm việc
    const workingHours = moment.duration(workingTime).asHours();

    if (workingHours >= 4 && workingHours < 8) {
      workday = 0.5;
    } else if (workingHours === 8) {
      workday = 1;
    }

    if (existingRecord) {
      // check thứ 7 chủ nhật
      const dateTimeKeeping = moment(req.body.employees.date_timekeeping);
      if (dateTimeKeeping.day() === 0 || dateTimeKeeping.day() === 6) {
        res.status(400).json({ message: "Ngày chấm công không hợp lệ!" });
        return;
      }
      const findDoneTimeKeeping = existingRecord.employees.find(
        (item) => item.date_timekeeping === req.body.employees.date_timekeeping
      );
      if (findDoneTimeKeeping) {
        res.status(400).json({ message: "Đã chấm công trong ngày hôm nay" });
      } else {
        let obj = { ...req.body.employees, workday };
        existingRecord.employees.push(obj);
        await existingRecord.save();
        res.status(200).json(existingRecord);
      }
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
