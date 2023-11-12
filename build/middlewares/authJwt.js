"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isModerator = exports.isAdmin = exports.verifyToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var auth_1 = require("../models/auth");
var ROLES = auth_1.ObjectDatabase.role;
var USER = auth_1.ObjectDatabase.user;
var verifyToken = function (req, res, next) {
    var token = req.body.token || req.query.token || req.header["x-access-token"];
    if (!token)
        return res.status(401).send("Access Denied");
    try {
        var verified = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET ? process.env.TOKEN_SECRET : "");
        next();
    }
    catch (err) {
        return res.status(400).send("Invalid Token");
    }
};
exports.verifyToken = verifyToken;
var isAdmin = function (req, res, next) {
    USER.findById(req.userId)
        .then(function (userID) {
        ROLES.find({ _id: { $in: userID.role_id } })
            .then(function (roles) {
            for (var i = 0; i < roles.length; i++) {
                if (roles[i].name === "admin") {
                    next();
                    return;
                }
            }
            res.status(403).send({ message: "Require Admin Role!" });
            return;
        })
            .catch(function (err) {
            res.status(500).send({ message: err });
            return;
        });
    })
        .catch(function (error) {
        res.status(500).send({ message: error });
        return;
    });
};
exports.isAdmin = isAdmin;
var isModerator = function (req, res, next) {
    USER.findById(req.userId).then(function (userID) {
        ROLES.find({
            _id: { $in: userID.role_id },
        })
            .then(function (roles) {
            for (var i = 0; i < roles.length; i++) {
                if (roles[i].name === "moderator") {
                    next();
                    return;
                }
            }
            res.status(403).send({ message: "Require Moderator Role!" });
            return;
        })
            .catch(function (err) {
            res.status(500).send({ message: err });
            return;
        });
    });
};
exports.isModerator = isModerator;
