"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var departments = new Schema({
    code: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "branchs",
        },
    ],
    name: String,
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("departments", departments);
