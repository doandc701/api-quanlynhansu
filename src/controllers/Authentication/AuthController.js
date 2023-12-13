import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sanitize from "mongo-sanitize"; // ngan chan injection
import ip from "ip";
import { client } from "../../services/redis.service.js";
import { ObjectDatabase } from "../../models/auth/index.js";
import Department from "../../models/department.model.js";
import Branchs from "../../models/branch.model.js";

import {
  checkLoginAttempts,
  setLoginAttempts,
} from "../../middlewares/loginAccountLimiter.js";
import "dotenv/config";

const ROLES = ObjectDatabase.role;
const USER = ObjectDatabase.user;

async function LIST_USER(req, res) {
  const newQuery = req.query;
  const searchCondition = {};
  const countRecord = await USER.countDocuments().catch(() => {});
  if (newQuery) {
    const skip =
      Number(newQuery.page) * Number(newQuery.limit) - Number(newQuery.limit);
    let query = USER.find();
    if (newQuery.sorts) {
      if (Object.keys(newQuery.sorts).length > 0) {
        query = query.sort(newQuery.sorts);
      }
    }
    if (newQuery.search && Object.keys(newQuery.search).length > 0) {
      searchCondition.$or = [];
      for (const key in newQuery.search) {
        const fieldCondition = {};
        fieldCondition[key] = { $regex: newQuery.search[key], $options: "i" };
        searchCondition.$or.push(fieldCondition);
      }
      query = USER.find(searchCondition);
    }
    const results = await query
      .skip(skip)
      .limit(newQuery.limit)
      .catch(() => {});

    return res.status(200).json({
      data: results,
      current_page: Number(newQuery.page),
      limit: Number(newQuery.limit),
      total: countRecord,
    });
  }
}

async function GET_USER(req, res, next) {
  const recordUsers = await USER.findOne({ code: req.params.code }).catch(
    () => {}
  );
  res.status(200).json({
    data: recordUsers,
  });
}

async function POST_USER(req, res) {
  const user = new USER(req.body);
  await user
    .save()
    .then((add) => {
      res.status(200).json(add);
    })
    .catch((error) => {
      res.status(401).json({ message: error });
    });
}

async function PUT_USER(req, res) {
  // console.log(req.body);
  let dataObject = Object.assign(req.body);
  const recordBranch = await Branchs.findOne({
    code: { $in: req.body.branch_code },
  });
  const recordDepartment = await Department.findOne({
    code: { $in: req.body.department_code },
  });
  if (recordBranch) dataObject.branch_code = recordBranch;
  if (recordDepartment) dataObject.department_code = recordDepartment;
  // console.log(dataObject);

  USER.updateOne({ code: req.params.code }, { $set: dataObject })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(401).json({ message: error });
    });
}

async function DELETE_USER(req, res) {
  await USER.deleteOne({ code: req.params.code })
    .then((deleted) => {
      res.status(200).json(deleted);
    })
    .catch((error) => {
      res.status(401).json({ message: error });
    });
}

const SignUp = async (req, res) => {
  const checkMailExits = await USER.findOne({
    email: sanitize(req.body.email),
  }).catch(() => {});
  if (checkMailExits) {
    res.status(422).json({ message: "Lỗi! Email này đã tồn tại." });
    return;
  }
  const user = new USER({
    code: req.body.code,
    email: sanitize(req.body.email),
    password: bcrypt.hashSync(req.body.password, 8),
  });
  user
    .save()
    .then((user) => {
      const RqRoles = req.body.roles;
      if (RqRoles) {
        ROLES.findOne({ name: { $in: RqRoles } })
          .then((roles) => {
            // user.role_id = roles.map((role) => role.code);
            user.role_id = roles.code;
            user
              .save()
              .then(() => {
                res.json({ message: "Tài khoản được đăng ký thành công!" });
              })
              .catch((err) => {
                res.status(500).json({ message: err });
                return;
              });
          })
          .catch((err) => {
            res.status(500).json({ message: err });
            return;
          });
      } else {
        ROLES.findOne({ name: "employee" })
          .then((role1) => {
            user.role_id = [role1._id];
            user
              .save()
              .then(() => {
                res.json({ message: "Tài khoản được đăng ký thành công!" });
              })
              .catch((err) => {
                res.status(500).json({ message: err });
                return;
              });
          })
          .catch((err) => {
            res.status(500).json({ message: err });
            return;
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err });
      return;
    });
};

const SignIn = async (req, res, next) => {
  let checkRedis = await checkLoginAttempts(ip.address());
  if (checkRedis?.pass) {
    // USER.findOne({
    //   $or: [
    //     { username: sanitize(req.body.username) },
    //     { email: sanitize(req.body.email) },
    //   ],
    // })
    USER.findOne({
      email: sanitize(req.body.email),
    })
      .populate("role_id", "-__v")
      .then(async (user) => {
        if (!user) {
          res
            .status(400)
            .json({ message: "Tài khoản hoặc mật khẩu không đúng !" });
          return;
        }
        const passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (!passwordIsValid) {
          checkRedis = await setLoginAttempts(ip.address());
          const remaining = 3 - parseInt(checkRedis.data.count);
          res.status(404).json({
            message: `${
              remaining
                ? `Bạn còn ${remaining} lần nhập`
                : "Tài khoản hoặc mật khẩu không đúng !"
            }`,
          });
          return;
        }

        const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, {
          expiresIn: 86400, // 24 hours
        });
        let authorities = [];
        for (let i = 0; i < user.role_id.length; i++) {
          authorities.push(user.role_id[i].name.toUpperCase());
        }

        res.status(200).json({
          data: {
            data: user,
            roles: authorities,
            accessToken: token,
          },
          message: "Đăng nhập thành công.",
        });
      })
      .catch(() => {});
  }
  if (!checkRedis?.pass) {
    if (checkRedis?.data) {
      const wait1 = checkRedis.wait;
      const remaining = 3 - parseInt(checkRedis.data.count);
      if (remaining <= 0) {
        return res.status(404).json({
          message: `Tài khoản của bạn đã bị khóa, vui lòng thử lại sau ${wait1} giây.`,
        });
      } else {
        return res.status(404).json({
          message: `Bạn còn ${remaining} lần nhập`,
        });
      }
    }
  }
};

export {
  LIST_USER,
  GET_USER,
  POST_USER,
  PUT_USER,
  DELETE_USER,
  SignIn,
  SignUp,
};
