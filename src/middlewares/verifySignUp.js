import { ObjectDatabase } from "../models/auth.js";

const ROLES = ObjectDatabase.role;
const USER = ObjectDatabase.user;

const checkDuplicateUsernameOrEmail = (req, res, next) => {
  // User
  USER.findOne({
    username: req.body.username,
  })
    .then((user) => {
      if (user) {
        res
          .status(400)
          .send({ message: "Failed! Username is already in use!" });
        return;
      }
    })
    .catch((error) => {
      res.status(400).send({ message: error });
      next();
    });

  // Email
  USER.findOne({
    email: req.body.email,
  })
    .then((email) => {
      if (email) {
        res.status(400).send({ message: "Failed! Email  is already in use!" });
        return;
      }
    })
    .catch((error) => {
      res.status(400).send({ message: error });
      next();
    });
};

const checkRolesExisted = (req, res, next) => {
  const RqRoles = req.body.roles;
  if (RqRoles) {
    for (let i = 0; i < RqRoles.length; i++) {
      if (!ROLES.name.includes(RqRoles[i])) {
        res.status(400).send({
          message: `Failed! Role ${RqRoles[i]} does not exist!`,
        });
        return;
      }
    }
  }
  next();
};

export const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};
