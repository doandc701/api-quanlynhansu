import jwt from "jsonwebtoken";
import { ObjectDatabase } from "../models/auth/index.js";
const ROLES = ObjectDatabase.role;
const USER = ObjectDatabase.user;
import "dotenv/config";

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.header["x-access-token"];
  if (!token) return res.status(401).send("Access Denied");
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    next();
  } catch (err) {
    return res.status(400).send("Invalid Token");
  }
};

const verifyTokenUser = (token) => {
  try {
    // Giải mã token và kiểm tra chữ ký
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    // Lấy thông tin người dùng từ payload
    const userInfo = decoded.id;
    return userInfo;
  } catch (error) {
    // Xử lý lỗi khi token không hợp lệ
    return res.status(401).json({
      code: 401,
      messages: "Token không hợp lệ",
    });
    return null;
  }
};

const jwtAuthMiddleware = (req, res, next) => {
  // Lấy token từ header
  const token = req.header("Authorization");
  // console.log(token);
  // Kiểm tra xem token có tồn tại không
  if (!token) {
    return res.status(401).json({
      code: 401,
      messages: "token.required",
    });
  }

  try {
    // Xác thực token
    const tokenSplit = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(tokenSplit, process.env.TOKEN_SECRET);
    req.user = decoded.user; // Lưu thông tin người dùng vào request để sử dụng trong các router khác
    next();
  } catch (error) {
    return res.status(401).json({
      code: 401,
      messages: "token.required",
    });
  }
};

const isAdmin = (req, res, next) => {
  USER.findById(req.userId)
    .then((userID) => {
      ROLES.find({ _id: { $in: userID.role_id } })
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

const isModerator = (req, res, next) => {
  USER.findById(req.userId).then((userID) => {
    ROLES.find({
      _id: { $in: userID.role_id },
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

export {
  verifyToken,
  isAdmin,
  isModerator,
  jwtAuthMiddleware,
  verifyTokenUser,
};
