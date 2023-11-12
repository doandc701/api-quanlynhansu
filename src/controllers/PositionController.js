import Position from "../models/position.model.js";

async function GET_POSITION(req, res) {
  const page = parseInt(req.query.page) || 1;
  const showLimit = parseInt(req.query.limit) || 10;
  const qsort = req.query.sorts;
  const qfilter = req.query.filters;
  const qsearch = req.query.search;
  const countRecord = await Position.countDocuments();
  Position.find(qfilter)
    .sort(qsort)
    .limit(showLimit)
    .skip(showLimit * page - showLimit)
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
        res.status(200).send({
          data: data,
          current_page: page,
          limit: showLimit,
          total: countRecord,
        });
      }
    })
    .catch(() => {
      res.status(401).send({ message: "Could not fetch the documents" });
    });
}

async function POST_POSITION(req, res) {
  const position = new Position(req.body);
  await position
    .save()
    .then((add) => {
      res.status(200).send(add);
    })
    .catch((error) => {
      res.status(401).send({ message: error });
    });
}

function PUT_POSITION(req, res) {
  Position.findByIdAndUpdate(req.params.id, req.body)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      res.status(401).send({ message: error });
    });
}

async function DELETE_POSITION(req, res) {
  await Position.findByIdAndDelete(req.params.id)
    .then((deleted) => {
      res.status(200).json("Delete Success");
    })
    .catch((error) => {
      res.status(401).send({ message: error });
    });
}

export { GET_POSITION, POST_POSITION, PUT_POSITION, DELETE_POSITION };
