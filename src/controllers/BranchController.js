import Branchs from "../models/branch.model.js";

async function GET_BRANCH(req, res) {
  const page = parseInt(req.query.page) || 1;
  const showLimit = parseInt(req.query.limit) || 10;
  const qsort = req.query.sorts || { _id: "desc" };
  const qfilter = req.query.filters;
  const qsearch = req.query.search;

  const recordBranchs = await Branchs.find(qfilter)
    .sort(qsort)
    .skip(showLimit * page - showLimit)
    .limit(showLimit)
    .catch(() => {});
  const countRecord = await Branchs.countDocuments().catch(() => {});

  if (qsearch) {
    const results = recordBranchs.filter((item) => {
      return (
        item.code.toLowerCase().indexOf(qsearch.toString().toLowerCase()) !== -1
      );
    });
    res.status(200).json({
      data: results,
      current_page: page,
      limit: showLimit,
      total: countRecord,
    });
  } else {
    res.status(200).json({
      data: recordBranchs,
      current_page: page,
      limit: showLimit,
      total: countRecord,
    });
  }
}

async function POST_BRANCH(req, res) {
  const branch = new Branchs(req.body);
  await branch
    .save()
    .then((add) => {
      res.status(200).json(add);
    })
    .catch((error) => {
      res.status(401).json({ message: error });
    });
}

function PUT_BRANCH(req, res) {
  Branchs.findByIdAndUpdate(req.params.id, req.body)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(401).json({ message: error });
    });
}

async function DELETE_BRANCH(req, res) {
  await Branchs.findByIdAndDelete(req.params.id)
    .then((deleted) => {
      res.status(200).json("Delete Success");
    })
    .catch((error) => {
      res.status(401).json({ message: error });
    });
}

export { GET_BRANCH, POST_BRANCH, PUT_BRANCH, DELETE_BRANCH };
