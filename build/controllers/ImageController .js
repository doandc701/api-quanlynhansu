"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE_IMAGE = exports.PUT_IMAGE = exports.POST_IMAGE = exports.GET_IMAGE = void 0;
var storage_1 = require("firebase/storage");
var auth_1 = require("@firebase/auth");
var image_model_1 = __importDefault(require("../models/image.model"));
var firebase_config_1 = __importDefault(require("../config/firebase.config"));
function uploadImage(file, quantity) {
    return __awaiter(this, void 0, void 0, function () {
        var storageFB, dateTime, fileName, storageRef, metadata, snapshot, downloadURL, i, dateTime, fileName, storageRef, metadata, saveImage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    storageFB = (0, storage_1.getStorage)();
                    return [4 /*yield*/, (0, auth_1.signInWithEmailAndPassword)(firebase_config_1.default, process.env.FIREBASE_USER ? process.env.FIREBASE_USER : "", process.env.FIREBASE_AUTH ? process.env.FIREBASE_AUTH : "")];
                case 1:
                    _a.sent();
                    if (!(quantity === "single")) return [3 /*break*/, 4];
                    dateTime = Date.now();
                    fileName = "images/".concat(dateTime);
                    storageRef = (0, storage_1.ref)(storageFB, fileName);
                    metadata = {
                        contentType: file.type,
                    };
                    return [4 /*yield*/, (0, storage_1.uploadBytesResumable)(storageRef, file.buffer, metadata)];
                case 2:
                    snapshot = _a.sent();
                    return [4 /*yield*/, (0, storage_1.getDownloadURL)(snapshot.ref)];
                case 3:
                    downloadURL = _a.sent();
                    return [2 /*return*/, downloadURL];
                case 4:
                    if (!(quantity === "multiple")) return [3 /*break*/, 11];
                    i = 0;
                    _a.label = 5;
                case 5:
                    if (!(i < file.images.length)) return [3 /*break*/, 10];
                    dateTime = Date.now();
                    fileName = "images/".concat(dateTime);
                    storageRef = (0, storage_1.ref)(storageFB, fileName);
                    metadata = {
                        contentType: file.images[i].mimetype,
                    };
                    return [4 /*yield*/, image_model_1.default.create({ imageUrl: fileName })];
                case 6:
                    saveImage = _a.sent();
                    file.item.imageId.push({ _id: saveImage._id });
                    return [4 /*yield*/, file.item.save()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, (0, storage_1.uploadBytesResumable)(storageRef, file.images[i].buffer, metadata)];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9:
                    i++;
                    return [3 /*break*/, 5];
                case 10: return [2 /*return*/];
                case 11: return [2 /*return*/];
            }
        });
    });
}
function GET_IMAGE(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var page, showLimit;
        return __generator(this, function (_a) {
            page = req.query.p || 1;
            showLimit = 10;
            image_model_1.default.find({})
                .limit(showLimit)
                .skip(Number(page) * showLimit)
                .then(function (data) {
                res.status(200).send(data);
            })
                .catch(function () {
                res.status(401).send({ message: "Could not fetch the documents" });
            });
            return [2 /*return*/];
        });
    });
}
exports.GET_IMAGE = GET_IMAGE;
function POST_IMAGE(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var image, file, buildImage, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    image = new image_model_1.default(req.body);
                    if (!req.file) return [3 /*break*/, 5];
                    file = {
                        type: req.file.mimetype,
                        buffer: req.file.buffer,
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, uploadImage(file, "single")];
                case 2:
                    buildImage = _a.sent();
                    image.path = buildImage;
                    return [4 /*yield*/, image
                            .save()
                            .then(function (add) {
                            res.status(200).send(add);
                        })
                            .catch(function (error) {
                            res.status(422).send({ message: "Ảnh đã tồn tại !" });
                        })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    res.status(401).send({ message: error_1 });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.POST_IMAGE = POST_IMAGE;
function PUT_IMAGE(req, res) {
    image_model_1.default.findByIdAndUpdate(req.params.id, req.body)
        .then(function (data) {
        res.status(200).send(data);
    })
        .catch(function (error) {
        res.status(401).send({ message: error });
    });
}
exports.PUT_IMAGE = PUT_IMAGE;
function DELETE_IMAGE(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, image_model_1.default.findByIdAndDelete(req.params.id)
                        .then(function (deleted) {
                        res.status(200).json("Delete Success");
                    })
                        .catch(function (error) {
                        res.status(401).send({ message: error });
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.DELETE_IMAGE = DELETE_IMAGE;
