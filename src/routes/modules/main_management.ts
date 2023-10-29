import express, { Request, Response } from "express";
import {
  GET_BRANCH,
  POST_BRANCH,
  PUT_BRANCH,
  DELETE_BRANCH,
} from "../../controllers/BranchController";

import {
  GET_DEPARTMENT,
  POST_DEPARTMENT,
  PUT_DEPARTMENT,
  DELETE_DEPARTMENT,
} from "../../controllers/DepartmentController";

import {
  GET_POSITION,
  POST_POSITION,
  PUT_POSITION,
  DELETE_POSITION,
} from "../../controllers/PositionController";
const router = express.Router();

// position
router.delete("/branch/:id", DELETE_POSITION);
router.put("/branch/:id", PUT_POSITION);
router.post("/branch", POST_POSITION);
router.get("/branch", GET_POSITION);

// department
router.delete("/department/:id", DELETE_DEPARTMENT);
router.put("/department/:id", PUT_DEPARTMENT);
router.post("/department", POST_DEPARTMENT);
router.get("/department", GET_DEPARTMENT);

// branch
router.delete("/branch/:id", DELETE_BRANCH);
router.put("/branch/:id", PUT_BRANCH);
router.post("/branch", POST_BRANCH);
router.get("/branch", GET_BRANCH);

export default router;
