import Department from "../models/department.model.js";

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
  const checkout = new Department(req.body);
  await checkout
    .save()
    .then((add) => {
      res.status(200).json(add);
    })
    .catch((error) => {
      res.status(401).json({ message: error });
    });
}

function PUT_DEPARTMENT(req, res) {
  Department.findByIdAndUpdate(req.params.id, req.body)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(401).json({ message: error });
    });
}

async function DELETE_DEPARTMENT(req, res) {
  await Department.findByIdAndDelete(req.params.id)
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
