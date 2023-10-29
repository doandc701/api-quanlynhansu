import express, { Request, Response } from "express";

import {
  GET_CATEGORIES,
  POST_CATEGORIES,
  PUT_CATEGORIES,
  DELETE_CATEGORIES,
} from "../../controllers/CategoriesController";

const router = express.Router();

router.delete("/:id", DELETE_CATEGORIES);
router.put("/:id", PUT_CATEGORIES);
router.post("/", POST_CATEGORIES);
router.get("/", GET_CATEGORIES);

export default router;
