import Department from "../models/department.model.js";

async function GET_DEPARTMENT(req, res) {
  const page = req.query.p || 1;
  const showLimit = 10;
  Department.find({})
    .limit(showLimit)
    .skip(Number(page) * showLimit)
    .populate("code")
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(() => {
      res.status(401).send({ message: "Could not fetch the documents" });
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