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

const ROLES = ObjectDatabase.role;
const USER = ObjectDatabase.user;

const SignUp = async (req, res) => {
  const checkMailExits = await USER.findOne({
    email: sanitize(req.body.email),
  }).catch(() => {});
  if (checkMailExits) {
    res.status(422).send({ message: "Lỗi! Email này đã tồn tại." });
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
                res.send({ message: "Tài khoản được đăng ký thành công!" });
              })
              .catch((err) => {
                res.status(500).send({ message: err });
                return;
              });
          })
          .catch((err) => {
            res.status(500).send({ message: err });
            return;
          });
      } else {
        ROLES.findOne({ name: "user" })
          .then((role1) => {
            user.role_id = [role1._id];
            user
              .save()
              .then(() => {
                res.send({ message: "Tài khoản được đăng ký thành công!" });
              })
              .catch((err) => {
                res.status(500).send({ message: err });
                return;
              });
          })
          .catch((err) => {
            res.status(500).send({ message: err });
            return;
          });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err });
      return;
    });
};

const SignIn = async (req, res, next) => {
  let checkRedis = await checkLoginAttempts(ip.address());
  if (checkRedis?.pass) {
    USER.findOne({
      $or: [
        { username: sanitize(req.body.username) },
        { email: sanitize(req.body.username) },
      ],
    })
      .populate("roles", "-__v")
      .then(async (user) => {
        if (!user) {
          res
            .status(400)
            .send({ message: "Tài khoản hoặc mật khẩu không đúng !" });
          return;
        }
        const passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (!passwordIsValid) {
          checkRedis = await setLoginAttempts(ip.address());
          const remaining = 3 - parseInt(checkRedis.data.count);
          res.status(404).send({
            message: `${
              remaining
                ? `Bạn còn ${remaining} lần nhập`
                : "Tài khoản hoặc mật khẩu không đúng !"
            }`,
          });
          return;
        }
        const token = jwt.sign(
          { id: user.id },
          process.env.TOKEN_SECRET ? process.env.TOKEN_SECRET : "",
          {
            expiresIn: 86400, // 24 hours
          }
        );
        let authorities = [];
        for (let i = 0; i < user.roles.length; i++) {
          authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }
        res.status(200).send({
          data: {
            id: user._id,
            username: user.username,
            email: user.email,
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
        return res.status(404).send({
          message: `Tài khoản của bạn đã bị khóa, vui lòng thử lại sau ${wait1} giây.`,
        });
      } else {
        return res.status(404).send({
          message: `Bạn còn ${remaining} lần nhập`,
        });
      }
    }
  }
};

export { SignIn, SignUp };
