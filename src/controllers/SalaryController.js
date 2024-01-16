import moment from "moment";
import ExcelJS from "exceljs";
import Salary from "../models/salary.model.js";

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
      if (!existingRecord.employees.length) {
        existingRecord.employees.push(req.body.employees["0"]);
        await existingRecord.save();
        res.status(200).json(existingRecord);
        return;
      }
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

async function EXPORT_TO_EXCEL(req, res) {
  const workbook = new ExcelJS.Workbook();
  const recordSalary = await Salary.findOne({
    year: moment().year(),
  }).catch(() => { });

  if (!recordSalary) {
    res.status(422).json({ message: "Không có dữ liệu để xuất" })
    return
  }
  const recordDetail = recordSalary.employees.find(
    (item) => item.employee.code === req.params.code
  );

  if (!recordDetail) {
    res.status(422).json({ message: "Không có dữ liệu để xuất" })
    return
  }

  const targetObject = {
    social_insurance: recordDetail.deducted_from_salary.social_insurance,
    health_insurance: recordDetail.deducted_from_salary.health_insurance,
    voluntary_insurance: recordDetail.deducted_from_salary.voluntary_insurance,
    personal_income_tax: recordDetail.deducted_from_salary.personal_income_tax ?? '',
    total: recordDetail.deducted_from_salary.total,
    code: recordDetail.employee.code,
    name: `${recordDetail.employee.first_name} ${recordDetail.employee.last_name}`,
    standard_working_day: recordDetail.standard_working_day,
    actual_workday: recordDetail.actual_workday,
    official_paid_working: recordDetail.official_paid_working,
    month: recordDetail.month,
    salary_received: recordDetail.salary_received,
  }

  const worksheet = workbook.addWorksheet('Sheet 1');
  worksheet.columns = [
    {
      header: "Lương tháng", key: 'month', width: 15
    },
    {
      header: "Tên nhân viên", key: 'name', width: 30
    },
    {
      header: "Ngày công được tính", key: 'actual_workday', width: 25
    },
    {
      header: "Ngày công chuẩn", key: 'standard_working_day', width: 25
    },
    {
      header: "Lương chính thức", key: 'official_paid_working', width: 25
    },
    {
      header: "Bảo hiểm xã hội (8%)", key: 'social_insurance', width: 25
    },
    {
      header: "Bảo hiểm y tế (1.5%)", key: 'health_insurance', width: 25
    },
    {
      header: "Bảo hiểm thất nghiệp (1%)", key: 'voluntary_insurance', width: 25
    },
    {
      header: "Thuế thu nhập cá nhân", key: 'personal_income_tax', width: 25
    },
    {
      header: "Tổng các khoản khẩu trừ", key: 'total', width: 25
    },
    {
      header: "Thực lãnh", key: 'salary_received', width: 25
    },
  ]

  worksheet.addRow({
    month: targetObject.month,
    code: targetObject.code,
    name: targetObject.name,
    actual_workday: targetObject.actual_workday,
    standard_working_day: targetObject.standard_working_day,
    official_paid_working: targetObject.official_paid_working,
    social_insurance: targetObject.social_insurance,
    health_insurance: targetObject.health_insurance,
    voluntary_insurance: targetObject.voluntary_insurance,
    personal_income_tax: targetObject.personal_income_tax,
    total: targetObject.total,
    salary_received: targetObject.salary_received,
  })

  // Set up the response headers 
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"); 
  res.setHeader("Content-Disposition", "attachment; filename=" + "Salary.xlsx");
  await workbook.xlsx.write(res).catch(()=> {});
  res.end();
}

export { LIST_SALARY, GET_SALARY, POST_SALARY, PUT_SALARY, DELETE_SALARY, EXPORT_TO_EXCEL };
