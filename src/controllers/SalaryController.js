import Salary from "../models/salary.model.js";
import moment from "moment";

async function LIST_SALARY(req, res) {
  const { page, limit, sorts, search, filters } = req.query;

  const query = {};
  // if (filters.year) {
  //   query.year = filters.year;
  // }
  // if (filters.month) {
  //   query["employees.date_timekeeping"] = {
  //     $gte: `${filters.year}-${filters.month.padStart(2, "0")}-01`,
  //     $lt: `${filters.year}-${(parseInt(filters.month) + 1)
  //       .toString()
  //       .padStart(2, "0")}-01`,
  //   };
  // }

  // if (filters.code) {
  //   query["employees.employee.code"] = filters.code;
  // }

  const countRecord = await Salary.countDocuments().catch(() => {});

  const result = await Salary.find(query)
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

async function GET_SALARY(req, res) {
  const recordSalary = await Salary.findOne({
    code: req.params.code,
  }).catch(() => {});
  res.status(200).json({
    data: recordSalary,
  });
}

async function POST_SALARY(req, res) {
  try {
    if (
      !req.body.employees[0].actual_workday ||
      !req.body.employees[0].salary_received
    ) {
      res.status(400).json({ message: "Dữ kiện chưa đầy đủ để tính lương !" });
      return;
    }
    const existingRecord = await Salary.findOne({ year: req.body.year });
    if (existingRecord) {
      const findDoneTimeKeeping = existingRecord.employees.find(
        (item) => item.employee.code === req.body.employees[0].employee.code
      );
      if (findDoneTimeKeeping) {
        res
          .status(400)
          .json({ message: "Nhân viên đã được tính lương trước đó !" });
        return;
      }
      let obj = { ...req.body.employees["0"] };
      existingRecord.employees.push(obj);
      await existingRecord.save();
      res.status(200).json(existingRecord);
    } else {
      const newRecord = new Salary(req.body);
      await newRecord.save();
      res.status(200).json(newRecord);
    }
  } catch (error) {
    res.status(401).json({ message: error });
  }
}

function PUT_SALARY(req, res) {
  Salary.updateOne({ code: req.params.code }, { $set: req.body })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(401).json({ message: error });
    });
}

async function DELETE_SALARY(req, res) {
  await Salary.deleteOne({ code: req.params.code })
    .then((deleted) => {
      res.status(200).json(deleted);
    })
    .catch((error) => {
      res.status(401).json({ message: error });
    });
}

export { LIST_SALARY, GET_SALARY, POST_SALARY, PUT_SALARY, DELETE_SALARY };
