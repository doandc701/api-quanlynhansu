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
  jwtAuthMiddleware,
} from "../../middlewares/authJwt.js";

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
router.get("/api/test/all", jwtAuthMiddleware, allAccess);
router.get("/api/test/user", jwtAuthMiddleware, verifyToken, userBoard);
router.get("/api/test/mod", [verifyToken, isModerator], moderatorBoard);
router.get("/api/test/admin", [verifyToken, isAdmin], adminBoard);

// roles
router.get("/role", jwtAuthMiddleware, getRoles);
router.post("/role", jwtAuthMiddleware, postRoles);
export default router;
