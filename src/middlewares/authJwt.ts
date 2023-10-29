import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ObjectDatabase } from "../models/auth";
const ROLES = ObjectDatabase.role;
const USER = ObjectDatabase.user;

const verifyToken = (req: any, res: Response, next: NextFunction) => {
  const token =
    req.body.token || req.query.token || req.header["x-access-token"];
  if (!token) return res.status(401).send("Access Denied");
  try {
    const verified = jwt.verify(
      token,
      process.env.TOKEN_SECRET ? process.env.TOKEN_SECRET : ""
    );
    next();
  } catch (err) {
    return res.status(400).send("Invalid Token");
  }
};

const isAdmin = (req: any, res: Response, next: NextFunction) => {
  USER.findById(req.userId)
    .then((userID) => {
      ROLES.find({ _id: { $in: userID!.role_id } })
        .then((roles) => {
          for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "admin") {
              next();
              return;
            }
          }
          res.status(403).send({ message: "Require Admin Role!" });
          return;
        })
        .catch((err) => {
          res.status(500).send({ message: err });
          return;
        });
    })
    .catch((error) => {
      res.status(500).send({ message: error });
      return;
    });
};

const isModerator = (req: any, res: Response, next: NextFunction) => {
  USER.findById(req.userId).then((userID) => {
    ROLES.find({
      _id: { $in: userID!.role_id },
    })
      .then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "moderator") {
            next();
            return;
          }
        }
        res.status(403).send({ message: "Require Moderator Role!" });
        return;
      })
      .catch((err) => {
        res.status(500).send({ message: err });
        return;
      });
  });
};

export { verifyToken, isAdmin, isModerator };
