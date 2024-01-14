import Branchs from "../models/branch.model.js";
import Department from "../models/department.model.js";
import Salary from "../models/salary.model.js";
import Timekeeping from "../models/timekeeping.model.js";
import { ObjectDatabase } from "../models/auth/index.js";

const USER = ObjectDatabase.user;

async function LIST_STATISTIC(req, res, next) {
  const newStatistic = [];
  const countRecordBranch = await Branchs.countDocuments().catch(() => {});
  const countRecordDepartment = await Department.countDocuments().catch(
    () => {}
  );
  const countRecordSalary = await Salary.countDocuments().catch(() => {});
  const countRecordTimekeeping = await Timekeeping.countDocuments().catch(
    () => {}
  );
  const countRecordUSER = await USER.countDocuments().catch(() => {});
  newStatistic.push({
    key: "Chi nhánh",
    value: countRecordBranch,
  });
  newStatistic.push({
    key: "Bộ phận",
    value: countRecordDepartment,
  });
  newStatistic.push({
    key: "Lương",
    value: countRecordSalary,
  });
  newStatistic.push({
    key: "Chấm công",
    value: countRecordTimekeeping,
  });
  newStatistic.push({
    key: "Nhân viên",
    value: countRecordUSER,
  });
  res.status(200).json({
    data: newStatistic,
  });
}

export { LIST_STATISTIC };
