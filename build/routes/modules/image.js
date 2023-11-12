"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var ImageController_1 = require("../../controllers/ImageController ");
var uploadMulter_1 = require("../../middlewares/uploadMulter");
var router = express_1.default.Router();
router.delete("/image:id", ImageController_1.DELETE_IMAGE);
router.put("/image:id", ImageController_1.PUT_IMAGE);
router.post("/image", uploadMulter_1.uploads.single("path"), ImageController_1.POST_IMAGE);
router.get("/image", ImageController_1.GET_IMAGE);
exports.default = router;
