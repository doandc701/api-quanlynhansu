"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var UserController_1 = require("../../controllers/Authorization/UserController");
var authJwt_1 = require("../../middlewares/authJwt");
var basicAuth_1 = __importDefault(require("../../middlewares/basicAuth"));
var AuthController_1 = require("../../controllers/Authentication/AuthController");
var RolesController_1 = require("../../controllers/Authentication/RolesController");
// import { loginAccountLimiter } from "../../services/rateLimit.service";
var router = express_1.default.Router();
router.post("/register", AuthController_1.SignUp);
// PERMISSION ADMIN AND MODIFILED
router.post("/login", (0, basicAuth_1.default)(["653e841ffc470d2ccd17292b", "653e842bfc470d2ccd17292d"]), AuthController_1.SignIn);
// PERMISSION EMPLOYEE
router.post("/buyer/login", (0, basicAuth_1.default)(["653e8458fc470d2ccd17292f"]), AuthController_1.SignIn);
// Authorization:
router.get("/api/test/all", UserController_1.allAccess);
router.get("/api/test/user", authJwt_1.verifyToken, UserController_1.userBoard);
router.get("/api/test/mod", [authJwt_1.verifyToken, authJwt_1.isModerator], UserController_1.moderatorBoard);
router.get("/api/test/admin", [authJwt_1.verifyToken, authJwt_1.isAdmin], UserController_1.adminBoard);
// roles
router.get("/role", RolesController_1.getRoles);
router.post("/role", RolesController_1.postRoles);
exports.default = router;
