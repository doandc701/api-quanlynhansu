"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectRole = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var Role = new Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
    },
}, {
    timestamps: true,
});
exports.ObjectRole = mongoose_1.default.model("roles", Role);
