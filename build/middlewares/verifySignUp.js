"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignUp = void 0;
var auth_1 = require("../models/auth");
var ROLES = auth_1.ObjectDatabase.role;
var USER = auth_1.ObjectDatabase.user;
var checkDuplicateUsernameOrEmail = function (req, res, next) {
    // User
    USER.findOne({
        username: req.body.username,
    })
        .then(function (user) {
        if (user) {
            res
                .status(400)
                .send({ message: "Failed! Username is already in use!" });
            return;
        }
    })
        .catch(function (error) {
        res.status(400).send({ message: error });
        next();
    });
    // Email
    USER.findOne({
        email: req.body.email,
    })
        .then(function (email) {
        if (email) {
            res.status(400).send({ message: "Failed! Email  is already in use!" });
            return;
        }
    })
        .catch(function (error) {
        res.status(400).send({ message: error });
        next();
    });
};
var checkRolesExisted = function (req, res, next) {
    var RqRoles = req.body.roles;
    if (RqRoles) {
        for (var i = 0; i < RqRoles.length; i++) {
            if (!ROLES.name.includes(RqRoles[i])) {
                res.status(400).send({
                    message: "Failed! Role ".concat(RqRoles[i], " does not exist!"),
                });
                return;
            }
        }
    }
    next();
};
exports.verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
    checkRolesExisted: checkRolesExisted,
};
