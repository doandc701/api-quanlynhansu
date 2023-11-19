import Categories from "../models/category.model.js";

async function GET_CATEGORIES(req, res) {
  const page = parseInt(req.query.page) || 1;
  const showLimit = parseInt(req.query.limit) || 10;
  const qsort = req.query.sorts || { _id: "desc" };
  const qfilter = req.query.filters;
  const qsearch = req.query.search;

  const recordCategories = await Categories.find(qfilter)
    .sort(qsort)
    .skip(showLimit * page - showLimit)
    .limit(showLimit)
    .catch(() => {});
  const countRecord = await Categories.countDocuments().catch(() => {});

  res.status(200).json({
    data: recordCategories,
    current_page: page,
    limit: showLimit,
    total: countRecord,
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

export { GET_CATEGORIES, POST_CATEGORIES, PUT_CATEGORIES, DELETE_CATEGORIES };
