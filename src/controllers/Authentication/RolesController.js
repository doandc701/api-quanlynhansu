import { ObjectRole } from "../../models/auth/role.model.js";

export async function getRoles(req, res) {
  const page = parseInt(req.query.page) || 1;
  const showLimit = parseInt(req.query.limit) || 10;
  const qsort = req.query.sorts;
  const qfilter = req.query.filters;
  const qsearch = req.query.search;
  // console.log(qsearch);
  ObjectRole.find(qfilter)
    .sort(qsort)
    .limit(showLimit)
    .skip(showLimit * page - showLimit)
    .then((role) => {
      res.status(200).json(role);
    })
    .catch(() => {
      res.status(500).json({ error: "Could not fetch the documents" });
    });
}

export async function postRoles(req, res) {
  const role = new ObjectRole(req.body);
  await role
    .save()
    .then((add) => {
      res.status(200).send(add);
    })
    .catch((error) => {
      res.status(401).send({ message: error });
    });
}
