"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiLimit = void 0;
var express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.apiLimit = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 10,
    message: "Too many connection",
    standardHeaders: true,
    legacyHeaders: false,
    handler: function (req, res) {
        res.status(429).send({
            status: 500,
            message: "Too many request",
        });
    },
    skip: function (req, res) {
        // if (req.ip === "::1") return true;
        return false;
    },
});
