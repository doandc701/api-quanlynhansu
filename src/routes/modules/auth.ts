import express, { Request, Response } from "express";
import {
  allAccess,
  userBoard,
  adminBoard,
  moderatorBoard,
} from "../../controllers/Authorization/UserController";

import { verifyToken, isAdmin, isModerator } from "../../middlewares/authJwt";
import authPage from "../../middlewares/basicAuth";

import {
  SignUp,
  SignIn,
} from "../../controllers/Authentication/AuthController";

import {
  getRoles,
  postRoles,
} from "../../controllers/Authentication/RolesController";

// import { loginAccountLimiter } from "../../services/rateLimit.service";

const router = express.Router();

router.post("/register", SignUp);
// PERMISSION ADMIN AND MODIFILED
router.post(
  "/login",
  authPage(["653e841ffc470d2ccd17292b", "653e842bfc470d2ccd17292d"]),
  SignIn
);
// PERMISSION EMPLOYEE
router.post("/buyer/login", authPage(["653e8458fc470d2ccd17292f"]), SignIn);

// Authorization:
router.get("/api/test/all", allAccess);
router.get("/api/test/user", verifyToken, userBoard);
router.get("/api/test/mod", [verifyToken, isModerator], moderatorBoard);
router.get("/api/test/admin", [verifyToken, isAdmin], adminBoard);

// roles
router.get("/role", getRoles);
router.post("/role", postRoles);
export default router;
