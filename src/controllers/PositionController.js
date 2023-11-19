import Position from "../models/position.model.js";

async function GET_POSITION(req, res) {
  const page = parseInt(req.query.page) || 1;
  const showLimit = parseInt(req.query.limit) || 10;
  const qsort = req.query.sorts || { _id: "desc" };
  const qfilter = req.query.filters;
  const qsearch = req.query.search;

  const countRecord = await Position.countDocuments().catch(() => {});
  const recordPosition = await Position.find(qfilter)
    .sort(qsort)
    .skip(showLimit * page - showLimit)
    .limit(showLimit)
    .catch(() => {});

  if (qsearch) {
    const results = recordPosition.filter((item) => {
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
      data: recordPosition,
      current_page: page,
      limit: showLimit,
      total: countRecord,
    });
  }
}

async function POST_POSITION(req, res) {
  const position = new Position(req.body);
  await position
    .save()
    .then((add) => {
      res.status(200).json(add);
    })
    .catch((error) => {
      res.status(401).json({ message: error });
    });
}

function PUT_POSITION(req, res) {
  Position.findByIdAndUpdate(req.params.id, req.body)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(401).json({ message: error });
    });
}

async function DELETE_POSITION(req, res) {
  await Position.findByIdAndDelete(req.params.id)
    .then((deleted) => {
      res.status(200).json("Delete Success");
    })
    .catch((error) => {
      res.status(401).json({ message: error });
    });
}

export { GET_POSITION, POST_POSITION, PUT_POSITION, DELETE_POSITION };
