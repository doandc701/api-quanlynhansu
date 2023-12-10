import express from "express";

import {
  LIST_CATEGORIES,
  GET_CATEGORIES,
  POST_CATEGORIES,
  PUT_CATEGORIES,
  DELETE_CATEGORIES,
} from "../../controllers/CategoriesController.js";

const router = express.Router();

router.delete("/:code", DELETE_CATEGORIES);
router.put("/:code", PUT_CATEGORIES);
router.post("/", POST_CATEGORIES);
router.get("/:code", GET_CATEGORIES);
router.get("/", LIST_CATEGORIES);

export default router;
