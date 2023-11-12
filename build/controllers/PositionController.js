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
exports.DELETE_POSITION = exports.PUT_POSITION = exports.POST_POSITION = exports.GET_POSITION = void 0;
var position_model_1 = __importDefault(require("../models/position.model"));
function GET_POSITION(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var page, showLimit, qsearch, qsort;
        return __generator(this, function (_b) {
            page = req.query.page || 1;
            showLimit = Number(req.query.limit) || 10;
            qsearch = req.query.search;
            qsort = (_a = req.query.sort) === null || _a === void 0 ? void 0 : _a.toString();
            position_model_1.default.find({})
                .limit(showLimit)
                .skip(Number(page) * showLimit)
                .sort(qsort)
                .then(function (data) {
                if (qsearch) {
                    var results = data.filter(function (item) {
                        return (item.code
                            .toLowerCase()
                            .indexOf(qsearch.toString().toLowerCase()) !== -1);
                    });
                    res.status(200).send(results);
                }
                else {
                    res.status(200).send(data);
                }
            })
                .catch(function () {
                res.status(401).send({ message: "Could not fetch the documents" });
            });
            return [2 /*return*/];
        });
    });
}
exports.GET_POSITION = GET_POSITION;
function POST_POSITION(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var position;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    position = new position_model_1.default(req.body);
                    return [4 /*yield*/, position
                            .save()
                            .then(function (add) {
                            res.status(200).send(add);
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
exports.POST_POSITION = POST_POSITION;
function PUT_POSITION(req, res) {
    position_model_1.default.findByIdAndUpdate(req.params.id, req.body)
        .then(function (data) {
        res.status(200).send(data);
    })
        .catch(function (error) {
        res.status(401).send({ message: error });
    });
}
exports.PUT_POSITION = PUT_POSITION;
function DELETE_POSITION(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, position_model_1.default.findByIdAndDelete(req.params.id)
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
exports.DELETE_POSITION = DELETE_POSITION;
