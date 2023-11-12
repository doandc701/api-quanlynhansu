import Department from "../models/department.model.js";

async function GET_DEPARTMENT(req, res) {
  const page = parseInt(req.query.page) || 1;
  const showLimit = parseInt(req.query.limit) || 10;
  const qsort = req.query.sorts;
  const qfilter = req.query.filters;
  const qsearch = req.query.search;

  const countRecord = await Department.countDocuments().catch(() => {});
  const recordDepartment = await Department.find(qfilter)
    .sort(qsort)
    .skip(showLimit * page - showLimit)
    .limit(showLimit)
    .catch(() => {});

  res.status(200).json({
    data: recordDepartment,
    current_page: page,
    limit: showLimit,
    total: countRecord,
  });
}

async function POST_DEPARTMENT(req, res) {
  const checkout = new Department(req.body);
  await checkout
    .save()
    .then((add) => {
      res.status(200).send(add);
    })
    .catch((error) => {
      res.status(401).send({ message: error });
    });
}

function PUT_DEPARTMENT(req, res) {
  Department.findByIdAndUpdate(req.params.id, req.body)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      res.status(401).send({ message: error });
    });
}

async function DELETE_DEPARTMENT(req, res) {
  await Department.findByIdAndDelete(req.params.id)
    .then((deleted) => {
      res.status(200).json("Delete Success");
    })
    .catch((error) => {
      res.status(401).send({ message: error });
    });
}

export { GET_DEPARTMENT, POST_DEPARTMENT, PUT_DEPARTMENT, DELETE_DEPARTMENT };
