import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sanitize from "mongo-sanitize"; // ngan chan injection
import ip from "ip";
import { client } from "../../services/redis.service.js";
import { ObjectDatabase } from "../../models/auth/index.js";
import {
  checkLoginAttempts,
  setLoginAttempts,
} from "../../middlewares/loginAccountLimiter.js";
import "dotenv/config";

const ROLES = ObjectDatabase.role;
const USER = ObjectDatabase.user;

async function GET_USER(req, res, next) {
  const page = parseInt(req.query.page) || 1;
  const showLimit = parseInt(req.query.limit) || 10;
  const qsort = req.query.sorts || { _id: "desc" };
  const qfilter = req.query.filters;
  const qsearch = req.query.search;

  const recordUsers = await USER.find(qfilter)
    .sort(qsort)
    .skip(showLimit * page - showLimit)
    .limit(showLimit)
    .catch(() => {});
  const countRecord = await USER.countDocuments().catch(() => {});

  if (qsearch) {
    const results = recordUsers.filter((item) => {
      return (
        item.code.toLowerCase().indexOf(qsearch.toString().toLowerCase()) !== -1
      );
    });
    res.status(200).json({
      data: results,
      current_page: page,
      limit: showLimit,
      total: countRecord,
    });
  } else {
    res.status(200).json({
      data: recordUsers,
      current_page: page,
      limit: showLimit,
      total: countRecord,
    });
  }
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
    email: sanitize(req.body.email),
    password: bcrypt.hashSync(req.body.password, 8),
  });
  user
    .save()
    .then((user) => {
      const RqRoles = req.body.roles;
      if (RqRoles) {
        ROLES.find({ name: { $in: RqRoles } })
          .then((roles) => {
            user.role_id = roles.map((role) => role._id);
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
            ...user,
            nameRole: authorities,
          },
          // data: {
          //   id: user._id,
          //   username: user.username,
          //   email: user.email,
          //   roles: authorities,
          //   accessToken: token,
          // },
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

export { SignIn, SignUp, GET_USER };
