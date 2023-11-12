import { ObjectUsers } from "../models/auth/user.model.js";

const authPage = (permission) => {
  return async (req, res, next) => {
    const { username } = req.body;
    const result = await ObjectUsers.findOne({ username });
    if (!result) {
      next();
      return;
    }
    if (!permission.includes(result.role_id.toString())) {
      res.status(401).send({ message: "Bạn không có quyền!" });
      return;
    }
    next();
  };
};

export default authPage;
