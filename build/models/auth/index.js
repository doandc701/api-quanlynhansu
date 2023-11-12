"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectDatabase = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var user_model_1 = require("./user.model");
var role_model_1 = require("./role.model");
mongoose_1.default.Promise = global.Promise;
exports.ObjectDatabase = {
    user: user_model_1.ObjectUsers,
    role: role_model_1.ObjectRole,
    mongoose: mongoose_1.default,
};
