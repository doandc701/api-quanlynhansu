import { Request, Response, NextFunction } from "express";
import { ObjectUsers } from "../models/auth/user.model";

const authPage = (permission: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.body;
    const result = await ObjectUsers.findOne({ username });
    if (!result) {
      next();
      return;
    }
    if (!permission.includes(result!.role_id.toString())) {
      res.status(401).send({ message: "Bạn không có quyền!" });
      return;
    }
    next();
  };
};

export default authPage;
