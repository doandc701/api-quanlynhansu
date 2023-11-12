"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
var auth_1 = __importDefault(require("./modules/auth"));
var categories_1 = __importDefault(require("./modules/categories"));
var main_management_1 = __importDefault(require("./modules/main_management"));
var image_1 = __importDefault(require("./modules/image"));
var routes = function (app) {
    // routes
    app.get("/", function (req, res) {
        res.json("Wellcome to api");
    });
    app.use("/auth", auth_1.default);
    app.use("/management", main_management_1.default);
    app.use("/category", categories_1.default);
    app.use("/upload", image_1.default);
};
exports.routes = routes;
