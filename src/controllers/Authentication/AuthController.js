import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sanitize from "mongo-sanitize"; // ngan chan injection
import ip from "ip";
import { client } from "../../services/redis.service.js";
import { ObjectDatabase } from "../../models/auth/index.js";
import Department from "../../models/department.model.js";
import Branchs from "../../models/branch.model.js";
import Image from "../../models/image.model.js";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { signInWithEmailAndPassword } from "@firebase/auth";
import {
  checkLoginAttempts,
  setLoginAttempts,
} from "../../middlewares/loginAccountLimiter.js";
import { verifyTokenUser } from "../../middlewares/authJwt.js";

import analytics from "../../config/firebase.config.js";
import nodemailer from "nodemailer";
import "dotenv/config";

const ROLES = ObjectDatabase.role;
const USER = ObjectDatabase.user;

// Tạo một transporter với thông tin đăng nhập của bạn
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.forwardemail.net",
  port: 465,
  secure: true,
  auth: {
    user: process.env.AUTH_MAILER, // Địa chỉ email của bạn
    pass: process.env.PASS_MAILER, // Mật khẩu của bạn
  },
});

const authFirebase = await signInWithEmailAndPassword(
  analytics,
  process.env.FIREBASE_USER,
  process.env.FIREBASE_AUTH
).catch(() => {});
const storageFB = getStorage();

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
  let dataObject = Object.assign(req.body);
  let passDefault = `${req.body.code}NSda$`;
  dataObject.password = bcrypt.hashSync(passDefault, 8);
  const recordBranch = await Branchs.findOne({
    code: { $in: req.body.branch_code },
  });
  const recordDepartment = await Department.findOne({
    code: { $in: req.body.department_code },
  });
  if (recordBranch) dataObject.branch_code = recordBranch;
  if (recordDepartment) dataObject.department_code = recordDepartment;

  const user = new USER(dataObject);
  await user
    .save()
    .then((add) => {
      // Đối tượng chứa thông tin email
      const mailOptions = {
        from: `QuanLyNhanSu <${process.env.AUTH_MAILER}>`, // Địa chỉ email người gửi
        to: add.email, // Địa chỉ email người nhận
        subject: "Chào mừng bạn đến với hệ thống",
        html: `<p>Dưới đây là tài khoản và mật khẩu để đăng nhập vào hệ thống</p>
            <ul>
                <li>Tài khoản: ${add.email}</li>
                <li>Mật khẩu: ${passDefault}</li>
            </ul>
            <p>Click vào link này để đăng nhập vào hệ thống: <a href='datt-hrm.vercel.app'>datt-hrm.vercel.app</a></p>
          `,
      };
      // Gửi email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(401).json({ message: error });
        }
      });
      res.status(200).json(add);
    })
    .catch((error) => {
      res.status(401).json({ message: error });
    });
}

async function PUT_USER(req, res) {
  let dataObject = Object.assign(req.body);
  const recordBranch = await Branchs.findOne({
    code: { $in: req.body.branch_code },
  });
  const recordDepartment = await Department.findOne({
    code: { $in: req.body.department_code },
  });
  if (recordBranch) dataObject.branch_code = recordBranch;
  if (recordDepartment) dataObject.department_code = recordDepartment;

  USER.updateOne({ code: req.params.code }, { $set: dataObject })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(401).json({ message: error });
    });
}

async function DELETE_USER(req, res) {
  const recorDeleteUser = await USER.findOne({ code: req.params.code }).catch(
    () => {}
  );
  if (!recorDeleteUser) {
    return res.status(404).json({ message: "Không tìm thấy user cần xóa!" });
  }

  if (recorDeleteUser.avatar_id) {
    const recorDeleteImg = await Image.findOne({
      _id: recorDeleteUser.avatar_id,
    }).catch(() => {});
    if (!recorDeleteImg) {
      return res.status(404).json({ message: "Không tìm thấy ảnh cần xóa!" });
    }

    if (!authFirebase) {
      return res
        .status(404)
        .json({ message: "Đăng nhập firebase không thành công!" });
    }
    const fileName = `images/${recorDeleteImg.origin_name}`;
    const fileRef = ref(storageFB, fileName);
    await deleteObject(fileRef).catch(() => {});
    await Image.deleteOne({ _id: recorDeleteImg._id }).catch(() => {});
    USER.deleteOne({ code: recorDeleteUser.code })
      .then((deleted) => {
        res.status(200).json(deleted);
      })
      .catch((error) => {
        res.status(401).json({ message: error });
      });
  } else {
    USER.deleteOne({ code: recorDeleteUser.code })
      .then((deleted) => {
        res.status(200).json(deleted);
      })
      .catch((error) => {
        res.status(401).json({ message: error });
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
        // let authorities = [];
        // for (let i = 0; i < user.role_id.length; i++) {
        //   authorities.push(user.role_id[i].name.toUpperCase());
        // }
        res.status(200).json({
          data: {
            data: user,
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

async function ChangePass(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  const userId = verifyTokenUser(token);
  if (!userId) {
    res.status(422).json({ message: "Token không hợp lệ" });
    return;
  }
  const getUser = await USER.findOne({ _id: userId });
  if (!getUser) {
    res.status(422).json({ message: "Người dùng không tồn tại." });
    return;
  }

  const isPasswordValid = await bcrypt.compare(
    req.body.old_password,
    getUser.password
  );

  if (!isPasswordValid) {
    res.status(422).json({ message: "Mật khẩu hiện tại không đúng." });
    return;
  }
  const hashedNewPassword = await bcrypt.hash(req.body.new_password, 8);
  getUser.password = hashedNewPassword;
  await getUser.save();
  res.status(200).json({ message: "Đổi mật khẩu thành công." });
}

export {
  LIST_USER,
  GET_USER,
  POST_USER,
  PUT_USER,
  DELETE_USER,
  SignIn,
  SignUp,
  ChangePass,
};
