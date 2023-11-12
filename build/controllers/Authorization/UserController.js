"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moderatorBoard = exports.adminBoard = exports.userBoard = exports.allAccess = void 0;
var allAccess = function (req, res) {
    res.status(200).send("Public Content.");
};
exports.allAccess = allAccess;
var userBoard = function (req, res) {
    res.status(200).send("User Content.");
};
exports.userBoard = userBoard;
var adminBoard = function (req, res) {
    res.status(200).send("Admin Content.");
};
exports.adminBoard = adminBoard;
var moderatorBoard = function (req, res) {
    res.status(200).send("Moderator Content.");
};
exports.moderatorBoard = moderatorBoard;
