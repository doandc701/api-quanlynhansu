import Salary from "../models/salary.model.js";
import moment from "moment";

async function LIST_SALARY(req, res) {
  const { page, limit, sorts, filters } = req.query;

  const query = {};
  if (filters.year) {
    query.year = filters.year;
  }

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
    year: moment().year(),
  }).catch(() => {});

  const recordDetail = recordSalary.employees.find(
    (item) => item.employee.code === req.params.code
  );
  res.status(200).json({
    data: recordDetail,
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
        (item) => item.month === req.body.employees[0].month
      );
      const hasNv =
        findDoneTimeKeeping.employee.code ===
        req.body.employees[0].employee.code;

      if (hasNv) {
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

async function PUT_SALARY(req, res) {
  const recordSalary = await Salary.findOne({
    year: req.params.year,
    "employees.employee.code": req.params.code,
  });
  let idxRecordUpdate = recordSalary.employees.findIndex(
    (item) => item.employee.code === req.params.code
  );
  recordSalary.employees.splice(idxRecordUpdate, 1);
  recordSalary.employees.push(req.body);
  await recordSalary.save();
  res.status(200).json(recordSalary);
}

async function DELETE_SALARY(req, res) {
  const recordSalary = await Salary.findOne({
    year: moment().year(),
    "employees.employee.code": req.params.code,
  });
  let idxRecordDelete = recordSalary.employees.findIndex(
    (item) => item.employee.code === req.params.code
  );
  recordSalary.employees.splice(idxRecordDelete, 1);
  await recordSalary.save();
  res.status(200).json(recordSalary);
}

export { LIST_SALARY, GET_SALARY, POST_SALARY, PUT_SALARY, DELETE_SALARY };
