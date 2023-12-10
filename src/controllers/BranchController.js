import Branchs from "../models/branch.model.js";

async function LIST_BRANCH(req, res) {
  const newQuery = req.query;
  const searchCondition = {};
  const countRecord = await Branchs.countDocuments().catch(() => {});
  if (newQuery) {
    const skip =
      Number(newQuery.page) * Number(newQuery.limit) - Number(newQuery.limit);
    let query = Branchs.find();
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
      query = Branchs.find(searchCondition);
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
async function GET_BRANCH(req, res) {
  const recordBranchs = await Branchs.findOne({ code: req.params.code }).catch(
    () => {}
  );
  res.status(200).json({
    data: recordBranchs,
  });
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
  Branchs.updateOne(req.body)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(401).json({ message: error });
    });
}

async function DELETE_BRANCH(req, res) {
  await Branchs.deleteOne({ code: req.params.code })
    .then((deleted) => {
      res.status(200).json(deleted);
    })
    .catch((error) => {
      res.status(401).json({ message: error });
    });
}

export { LIST_BRANCH, GET_BRANCH, POST_BRANCH, PUT_BRANCH, DELETE_BRANCH };
