import Branchs from "../models/branch.model.js";

async function GET_BRANCH(req, res) {
  const page = req.query.page || 1;
  const showLimit = Number(req.query.limit) || 10;
  const qsearch = req.query.search;
  const qsort = req.query.sort?.toString();
  Branchs.find({})
    .limit(showLimit)
    .skip(Number(page) * showLimit)
    .sort(qsort)
    .then((data) => {
      if (qsearch) {
        const results = data.filter((item) => {
          return (
            item.code
              .toLowerCase()
              .indexOf(qsearch.toString().toLowerCase()) !== -1
          );
        });
        res.status(200).send(results);
      } else {
        res.status(200).send(data);
      }
    })
    .catch(() => {
      res.status(401).send({ message: "Could not fetch the documents" });
    });
}

async function POST_BRANCH(req, res) {
  const branch = new Branchs(req.body);
  await branch
    .save()
    .then((add) => {
      res.status(200).send(add);
    })
    .catch((error) => {
      res.status(401).send({ message: error });
    });
}

function PUT_BRANCH(req, res) {
  Branchs.findByIdAndUpdate(req.params.id, req.body)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      res.status(401).send({ message: error });
    });
}

async function DELETE_BRANCH(req, res) {
  await Branchs.findByIdAndDelete(req.params.id)
    .then((deleted) => {
      res.status(200).json("Delete Success");
    })
    .catch((error) => {
      res.status(401).send({ message: error });
    });
}

export { GET_BRANCH, POST_BRANCH, PUT_BRANCH, DELETE_BRANCH };
