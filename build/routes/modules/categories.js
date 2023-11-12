"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var CategoriesController_1 = require("../../controllers/CategoriesController");
var router = express_1.default.Router();
router.delete("/:id", CategoriesController_1.DELETE_CATEGORIES);
router.put("/:id", CategoriesController_1.PUT_CATEGORIES);
router.post("/", CategoriesController_1.POST_CATEGORIES);
router.get("/", CategoriesController_1.GET_CATEGORIES);
exports.default = router;
