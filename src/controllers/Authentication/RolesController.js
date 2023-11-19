import { ObjectRole } from "../../models/auth/role.model.js";

export async function getRoles(req, res) {
  const page = parseInt(req.query.page) || 1;
  const showLimit = parseInt(req.query.limit) || 10;
  const qsort = req.query.sorts || { _id: "desc" };
  const qfilter = req.query.filters;
  const qsearch = req.query.search;

  const recordObjectRole = await ObjectRole.find(qfilter)
    .sort(qsort)
    .skip(showLimit * page - showLimit)
    .limit(showLimit)
    .catch(() => {});
  const countRecord = await ObjectRole.countDocuments().catch(() => {});

  res.status(200).json({
    data: recordObjectRole,
    current_page: page,
    limit: showLimit,
    total: countRecord,
  });
}

export async function postRoles(req, res) {
  const role = new ObjectRole(req.body);
  await role
    .save()
    .then((add) => {
      res.status(200).json(add);
    })
    .catch((error) => {
      res.status(401).json({ message: error });
    });
}
