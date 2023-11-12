import { ObjectRole } from "../../models/auth/role.model.js";

export async function getRoles(req, res) {
  const page = req.query.p || 1;
  const showLimitRoles = 10;
  ObjectRole.find({})
    .sort({ name: 1 })
    .limit(showLimitRoles)
    .skip(Number(page) * showLimitRoles)
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
