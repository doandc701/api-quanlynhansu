"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var BranchController_1 = require("../../controllers/BranchController");
var DepartmentController_1 = require("../../controllers/DepartmentController");
var PositionController_1 = require("../../controllers/PositionController");
var router = express_1.default.Router();
// position
router.delete("/branch/:id", PositionController_1.DELETE_POSITION);
router.put("/branch/:id", PositionController_1.PUT_POSITION);
router.post("/branch", PositionController_1.POST_POSITION);
router.get("/branch", PositionController_1.GET_POSITION);
// department
router.delete("/department/:id", DepartmentController_1.DELETE_DEPARTMENT);
router.put("/department/:id", DepartmentController_1.PUT_DEPARTMENT);
router.post("/department", DepartmentController_1.POST_DEPARTMENT);
router.get("/department", DepartmentController_1.GET_DEPARTMENT);
// branch
router.delete("/branch/:id", BranchController_1.DELETE_BRANCH);
router.put("/branch/:id", BranchController_1.PUT_BRANCH);
router.post("/branch", BranchController_1.POST_BRANCH);
router.get("/branch", BranchController_1.GET_BRANCH);
exports.default = router;
