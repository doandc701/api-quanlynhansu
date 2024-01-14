import DashboardPost from "../models/dashboard-post.model.js";
import { ObjectDatabase } from "../models/auth/index.js";

import { verifyTokenUser } from "../middlewares/authJwt.js";
import moment from "moment";

const USER = ObjectDatabase.user;

async function LIST_DASHBOARD_POST(req, res) {
  const newQuery = req.query;
  const searchCondition = {};
  const countRecord = await DashboardPost.countDocuments().catch(() => {});
  if (newQuery) {
    const skip =
      Number(newQuery.page) * Number(newQuery.limit) - Number(newQuery.limit);
    let query = DashboardPost.find();
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
      query = DashboardPost.find(searchCondition);
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
async function GET_DASHBOARD_POST(req, res) {
  const recordDashboardPost = await DashboardPost.findOne({
    _id: req.params.code,
  }).catch(() => {});
  res.status(200).json({
    data: recordDashboardPost,
  });
}

async function POST_DASHBOARD_POST(req, res) {
  const dashboardPost = new DashboardPost(req.body);
  await dashboardPost
    .save()
    .then((add) => {
      res.status(200).json({ message: "Thành công" });
    })
    .catch((error) => {
      res.status(401).json({ message: error });
    });
}

function PUT_DASHBOARD_POST(req, res) {
  DashboardPost.updateOne({ _id: req.params.code }, { $set: req.body })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(401).json({ message: error });
    });
}

async function DELETE_DASHBOARD_POST(req, res) {
  await DashboardPost.deleteOne({ _id: req.params.code })
    .then(() => {
      res.status(200).json({ message: "Xóa thành công" });
    })
    .catch((error) => {
      res.status(401).json({ message: error });
    });
}

async function POST_DASHBOARD_COMMENT(req, res) {
  const recordDashboardPost = await DashboardPost.findOne({
    _id: req.params.code,
  }).catch(() => {});
  let allInfor = [];
  const token = req.headers.authorization.split(" ")[1];
  const userId = verifyTokenUser(token);
  if (!userId) {
    res.status(401).json({ message: "Token không hợp lệ" });
    return;
  }
  const getUserComment = await USER.findOne({ _id: userId });
  allInfor.push({
    user: {
      name: `${getUserComment.first_name} ${getUserComment.last_name}`,
      avatar_path: getUserComment.avatar_path,
    },
    created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    comment: req.body.comment,
  });
  recordDashboardPost.comment.unshift(...allInfor);
  await recordDashboardPost.save().catch(() => {});
  res
    .status(200)
    .json({ message: "Bình luận thành công !", data: recordDashboardPost });
}

async function DELETE_DASHBOARD_COMMENT(req, res) {
  const recordComment = await DashboardPost.findOne({
    _id: req.params.code,
  }).catch(() => {});
  const recordUserCommented = recordComment.comment.findIndex(
    (item) => item._id.toString() === req.params.codeComment
  );
  recordComment.comment.splice(recordUserCommented, 1);
  await recordComment.save().catch(() => {});
  res.status(200).json({ message: "Đã xóa bình luận !" });
}

export {
  LIST_DASHBOARD_POST,
  GET_DASHBOARD_POST,
  POST_DASHBOARD_POST,
  PUT_DASHBOARD_POST,
  DELETE_DASHBOARD_POST,
  POST_DASHBOARD_COMMENT,
  DELETE_DASHBOARD_COMMENT,
};
