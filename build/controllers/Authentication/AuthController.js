"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUp = exports.SignIn = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var mongo_sanitize_1 = __importDefault(require("mongo-sanitize")); // ngan chan injection
var ip_1 = __importDefault(require("ip"));
var auth_1 = require("../../models/auth");
var loginAccountLimiter_1 = require("../../middlewares/loginAccountLimiter");
var ROLES = auth_1.ObjectDatabase.role;
var USER = auth_1.ObjectDatabase.user;
var SignUp = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var checkMailExits, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, USER.findOne({
                    email: (0, mongo_sanitize_1.default)(req.body.email),
                }).catch(function () { })];
            case 1:
                checkMailExits = _a.sent();
                if (checkMailExits) {
                    res.status(422).send({ message: "Lỗi! Email này đã tồn tại." });
                    return [2 /*return*/];
                }
                user = new USER({
                    email: (0, mongo_sanitize_1.default)(req.body.email),
                    password: bcryptjs_1.default.hashSync(req.body.password, 8),
                });
                user
                    .save()
                    .then(function (user) {
                    var RqRoles = req.body.roles;
                    if (RqRoles) {
                        ROLES.find({ name: { $in: RqRoles } })
                            .then(function (roles) {
                            user.role_id = roles.map(function (role) { return role._id; });
                            user
                                .save()
                                .then(function () {
                                res.send({ message: "Tài khoản được đăng ký thành công!" });
                            })
                                .catch(function (err) {
                                res.status(500).send({ message: err });
                                return;
                            });
                        })
                            .catch(function (err) {
                            res.status(500).send({ message: err });
                            return;
                        });
                    }
                    else {
                        ROLES.findOne({ name: "user" })
                            .then(function (role1) {
                            user.role_id = [role1._id];
                            user
                                .save()
                                .then(function () {
                                res.send({ message: "Tài khoản được đăng ký thành công!" });
                            })
                                .catch(function (err) {
                                res.status(500).send({ message: err });
                                return;
                            });
                        })
                            .catch(function (err) {
                            res.status(500).send({ message: err });
                            return;
                        });
                    }
                })
                    .catch(function (err) {
                    res.status(500).send({ message: err });
                    return;
                });
                return [2 /*return*/];
        }
    });
}); };
exports.SignUp = SignUp;
var SignIn = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var checkRedis, wait1, remaining;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, loginAccountLimiter_1.checkLoginAttempts)(ip_1.default.address())];
            case 1:
                checkRedis = _a.sent();
                if (checkRedis === null || checkRedis === void 0 ? void 0 : checkRedis.pass) {
                    USER.findOne({
                        $or: [
                            { username: (0, mongo_sanitize_1.default)(req.body.username) },
                            { email: (0, mongo_sanitize_1.default)(req.body.username) },
                        ],
                    })
                        .populate("roles", "-__v")
                        .then(function (user) { return __awaiter(void 0, void 0, void 0, function () {
                        var passwordIsValid, remaining, token, authorities, i;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!user) {
                                        res
                                            .status(400)
                                            .send({ message: "Tài khoản hoặc mật khẩu không đúng !" });
                                        return [2 /*return*/];
                                    }
                                    passwordIsValid = bcryptjs_1.default.compareSync(req.body.password, user.password);
                                    if (!!passwordIsValid) return [3 /*break*/, 2];
                                    return [4 /*yield*/, (0, loginAccountLimiter_1.setLoginAttempts)(ip_1.default.address())];
                                case 1:
                                    checkRedis = _a.sent();
                                    remaining = 3 - parseInt(checkRedis.data.count);
                                    res.status(404).send({
                                        message: "".concat(remaining
                                            ? "B\u1EA1n c\u00F2n ".concat(remaining, " l\u1EA7n nh\u1EADp")
                                            : "Tài khoản hoặc mật khẩu không đúng !"),
                                    });
                                    return [2 /*return*/];
                                case 2:
                                    token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.TOKEN_SECRET ? process.env.TOKEN_SECRET : "", {
                                        expiresIn: 86400, // 24 hours
                                    });
                                    authorities = [];
                                    for (i = 0; i < user.roles.length; i++) {
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
                                    return [2 /*return*/];
                            }
                        });
                    }); })
                        .catch(function () { });
                }
                if (!(checkRedis === null || checkRedis === void 0 ? void 0 : checkRedis.pass)) {
                    if (checkRedis === null || checkRedis === void 0 ? void 0 : checkRedis.data) {
                        wait1 = checkRedis.wait;
                        remaining = 3 - parseInt(checkRedis.data.count);
                        if (remaining <= 0) {
                            return [2 /*return*/, res.status(404).send({
                                    message: "T\u00E0i kho\u1EA3n c\u1EE7a b\u1EA1n \u0111\u00E3 b\u1ECB kh\u00F3a, vui l\u00F2ng th\u1EED l\u1EA1i sau ".concat(wait1, " gi\u00E2y."),
                                })];
                        }
                        else {
                            return [2 /*return*/, res.status(404).send({
                                    message: "B\u1EA1n c\u00F2n ".concat(remaining, " l\u1EA7n nh\u1EADp"),
                                })];
                        }
                    }
                }
                return [2 /*return*/];
        }
    });
}); };
exports.SignIn = SignIn;
