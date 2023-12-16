import Department from "../models/department.model.js";
import Branchs from "../models/branch.model.js";

async function LIST_DEPARTMENT(req, res) {
  const newQuery = req.query;
  const searchCondition = {};
  const countRecord = await Department.countDocuments().catch(() => {});
  if (newQuery) {
    const skip =
      Number(newQuery.page) * Number(newQuery.limit) - Number(newQuery.limit);
    let query = Department.find();
    if (newQuery.sorts) {
      if (Object.keys(newQuery.sorts).length > 0) {
        query = query.sort(newQuery.sorts);
      }
    }
    if (newQuery.search && Object.keys(newQuery.search).length > 0) {
      searchCondition.$or = [];
      for (const key in newQuery.search) {
        const fieldCondition = {};
        fieldCondition[key] = { $regex: newQuery.search[key], $options: "i" };
        searchCondition.$or.push(fieldCondition);
      }
      query = Department.find(searchCondition);
    }

    if (newQuery.filters) {
      if (newQuery.filters.branch) {
        query = query.where("branch_code.code").equals(newQuery.filters.branch);
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

async function GET_DEPARTMENT(req, res) {
  const recordDepartment = await Department.findOne({
    code: req.params.code,
  }).catch(() => {});
  res.status(200).json({
    data: recordDepartment,
  });
}

async function POST_DEPARTMENT(req, res) {
  let dataObject = Object.assign(req.body);
  const recordBranch = await Branchs.findOne({
    code: { $in: req.body.branch_code },
  });
  if (recordBranch) dataObject.branch_code = recordBranch;

  const checkout = new Department(dataObject);
  await checkout
    .save()
    .then((add) => {
      res.status(200).json(add);
    })
    .catch((error) => {
      res.status(401).json({ message: error });
    });
}

async function PUT_DEPARTMENT(req, res) {
  let dataObject = Object.assign(req.body);
  const recordBranch = await Branchs.findOne({
    code: { $in: req.body.branch_code },
  });
  if (recordBranch) dataObject.branch_code = recordBranch;

  Department.updateOne({ code: req.params.code }, { $set: dataObject })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(401).json({ message: error });
    });
}

async function DELETE_DEPARTMENT(req, res) {
  await Department.deleteOne({ code: req.params.code })
    .then((deleted) => {
      res.status(200).json("Delete Success");
    })
    .catch((error) => {
      res.status(401).json({ message: error });
    });
}

export {
  LIST_DEPARTMENT,
  GET_DEPARTMENT,
  POST_DEPARTMENT,
  PUT_DEPARTMENT,
  DELETE_DEPARTMENT,
};
