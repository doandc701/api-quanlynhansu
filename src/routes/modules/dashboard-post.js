import express from "express";

import {
  LIST_DASHBOARD_POST,
  GET_DASHBOARD_POST,
  POST_DASHBOARD_POST,
  POST_DASHBOARD_COMMENT,
  PUT_DASHBOARD_POST,
  DELETE_DASHBOARD_POST,
  DELETE_DASHBOARD_COMMENT,
} from "../../controllers/DashboardPostController.js";

const router = express.Router();

router.delete("/:code/delete-comment/:codeComment", DELETE_DASHBOARD_COMMENT);
router.delete("/:code", DELETE_DASHBOARD_POST);
router.put("/:code", PUT_DASHBOARD_POST);
router.post("/:code/comment", POST_DASHBOARD_COMMENT);
router.post("/", POST_DASHBOARD_POST);
router.get("/:code", GET_DASHBOARD_POST);
router.get("/", LIST_DASHBOARD_POST);

export default router;
