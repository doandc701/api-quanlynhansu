import Position from "../models/position.model.js";

async function LIST_POSITION(req, res) {
  const newQuery = req.query;
  const searchCondition = {};
  const countRecord = await Position.countDocuments().catch(() => {});
  if (newQuery) {
    const skip =
      Number(newQuery.page) * Number(newQuery.limit) - Number(newQuery.limit);
    let query = Position.find();
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
      query = Position.find(searchCondition);
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

async function GET_POSITION(req, res) {
  const recordPosition = await Position.findOne({
    code: req.params.code,
  }).catch(() => {});
  res.status(200).json({
    data: recordPosition,
  });
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

export {
  LIST_POSITION,
  GET_POSITION,
  POST_POSITION,
  PUT_POSITION,
  DELETE_POSITION,
};
