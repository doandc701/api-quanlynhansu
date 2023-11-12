"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
var ioredis_1 = __importDefault(require("ioredis"));
exports.client = new ioredis_1.default({
    port: 18005,
    host: "redis-18005.c295.ap-southeast-1-1.ec2.cloud.redislabs.com",
    username: "default",
    password: "yvKztdp9YLHAUyewD8mNaVYvSTAs6hTo",
    db: 0, // Defaults to 0
});
