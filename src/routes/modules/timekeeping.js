import express from "express";

import {
  LIST_TIMEKEEPING,
  GET_TIMEKEEPING,
  POST_TIMEKEEPING,
  PUT_TIMEKEEPING,
  DELETE_TIMEKEEPING,
} from "../../controllers/TimekeepingController.js";

const router = express.Router();

router.delete("/:code", DELETE_TIMEKEEPING);
router.put("/:code", PUT_TIMEKEEPING);
router.post("/", POST_TIMEKEEPING);
router.get("/:code", GET_TIMEKEEPING);
router.get("/", LIST_TIMEKEEPING);

export default router;
