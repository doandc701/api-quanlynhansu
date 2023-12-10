import express from "express";
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
  SignUp,
  SignIn,
} from "../../controllers/Authentication/AuthController.js";

import {
  getRoles,
  postRoles,
} from "../../controllers/Authentication/RolesController.js";

// import { loginAccountLimiter } from "../../services/rateLimit.service";

const router = express.Router();

router.post("/register", SignUp);
router.post("/login", SignIn);

// Authorization:
router.get("/api/test/all", allAccess);
router.get("/api/test/user", verifyToken, userBoard);
router.get("/api/test/mod", [verifyToken, isModerator], moderatorBoard);
router.get("/api/test/admin", [verifyToken, isAdmin], adminBoard);

// roles
router.get("/role", getRoles);
router.post("/role", postRoles);
export default router;
