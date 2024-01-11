import express from "express";
import {
  LIST_BRANCH,
  GET_BRANCH,
  POST_BRANCH,
  PUT_BRANCH,
  DELETE_BRANCH,
} from "../../controllers/BranchController.js";

import {
  LIST_DEPARTMENT,
  GET_DEPARTMENT,
  POST_DEPARTMENT,
  PUT_DEPARTMENT,
  DELETE_DEPARTMENT,
} from "../../controllers/DepartmentController.js";

import {
  LIST_POSITION,
  GET_POSITION,
  POST_POSITION,
  PUT_POSITION,
  DELETE_POSITION,
} from "../../controllers/PositionController.js";

import {
  allAccess,
  userBoard,
  adminBoard,
  moderatorBoard,
} from "../../controllers/Authorization/UserController.js";

import {
  verifyToken,
  isAdmin,
  isModerator,
} from "../../middlewares/authJwt.js";
import authPage from "../../middlewares/basicAuth.js";

import {
  LIST_USER,
  GET_USER,
  POST_USER,
  PUT_USER,
  DELETE_USER,
} from "../../controllers/Authentication/AuthController.js";

import {
  getRoles,
  postRoles,
} from "../../controllers/Authentication/RolesController.js";

import {
  LIST_SALARY,
  GET_SALARY,
  POST_SALARY,
  PUT_SALARY,
  DELETE_SALARY,
} from "../../controllers/SalaryController.js";

// import { loginAccountLimiter } from "../../services/rateLimit.service";

const router = express.Router();

// salary

router.delete("/salary/:code", DELETE_SALARY);
router.put("/salary/:code/:year", PUT_SALARY);
router.post("/salary", POST_SALARY);
router.get("/salary/:code", GET_SALARY);
router.get("/salary", LIST_SALARY);

// user
router.delete("/user/:code", DELETE_USER);
router.put("/user/:code", PUT_USER);
router.post("/user", POST_USER);
router.get("/user/:code", GET_USER);
router.get("/user", LIST_USER);

// Authorization:
router.get("/api/test/all", allAccess);
router.get("/api/test/user", verifyToken, userBoard);
router.get("/api/test/mod", [verifyToken, isModerator], moderatorBoard);
router.get("/api/test/admin", [verifyToken, isAdmin], adminBoard);

// roles
router.get("/role", getRoles);
router.post("/role", postRoles);

// position
router.delete("/position/:code", DELETE_POSITION);
router.put("/position/:code", PUT_POSITION);
router.post("/position", POST_POSITION);
router.get("/position/:code", GET_POSITION);
router.get("/position", LIST_POSITION);

// department
router.delete("/department/:code", DELETE_DEPARTMENT);
router.put("/department/:code", PUT_DEPARTMENT);
router.post("/department", POST_DEPARTMENT);
router.get("/department/:code", GET_DEPARTMENT);
router.get("/department", LIST_DEPARTMENT);

// branch
router.delete("/branch/:code", DELETE_BRANCH);
router.put("/branch/:code", PUT_BRANCH);
router.post("/branch", POST_BRANCH);
router.get("/branch/:code", GET_BRANCH);
router.get("/branch", LIST_BRANCH);

export default router;
