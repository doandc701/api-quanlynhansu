"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectUsers = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var User = new Schema({
    code: String,
    username: String,
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        sparse: true,
    },
    password: String,
    phone_number: String,
    branch_code: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "branchs",
        },
    ],
    department_code: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "departments",
        },
    ],
    postition_id: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "positions",
        },
    ],
    avatar_id: String,
    role_id: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "role",
        },
    ],
}, {
    timestamps: true,
});
exports.ObjectUsers = mongoose_1.default.model("users", User);
