import { ObjectUsers } from "../models/auth/user.model.js";

const authPage = (permission) => {
  return async (req, res, next) => {
    const { email } = req.body;
    const result = await ObjectUsers.findOne({ email });
    if (!result) {
      next();
      return;
    }
    if (!permission.includes(result.role_id.toString())) {
      res.status(401).json({ message: "Bạn không có quyền!" });
      return;
    }
    next();
  };
};

export default authPage;
