import Categories from "../models/category.model.js";

async function LIST_CATEGORIES(req, res) {
  const newQuery = req.query;
  const searchCondition = {};
  const countRecord = await Categories.countDocuments().catch(() => {});
  if (newQuery) {
    const skip =
      Number(newQuery.page) * Number(newQuery.limit) - Number(newQuery.limit);
    let query = Categories.find();
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
      query = Categories.find(searchCondition);
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

async function GET_CATEGORIES(req, res) {
  const recordCategories = await Categories.findOne({
    code: req.params.code,
  }).catch(() => {});
  res.status(200).json({
    data: recordCategories,
  });
}

async function POST_CATEGORIES(req, res) {
  const categories = new Categories(req.body);
  await categories
    .save()
    .then((add) => {
      res.status(200).json(add);
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
}

function PUT_CATEGORIES(req, res) {
  Categories.findByIdAndUpdate(req.params.id, req.body)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
}

async function DELETE_CATEGORIES(req, res) {
  await Categories.findByIdAndDelete(req.params.id)
    .then((deleted) => {
      res.status(200).json("Delete Success");
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
}

export {
  LIST_CATEGORIES,
  GET_CATEGORIES,
  POST_CATEGORIES,
  PUT_CATEGORIES,
  DELETE_CATEGORIES,
};
