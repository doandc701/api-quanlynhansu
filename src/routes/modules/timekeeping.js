import express from "express";

import {
  LIST_TIMEKEEPING,
  GET_TIMEKEEPING,
  POST_TIMEKEEPING_CHECK_IN,
  POST_TIMEKEEPING_CHECK_OUT,
  PUT_TIMEKEEPING,
  DELETE_TIMEKEEPING,
} from "../../controllers/TimekeepingController.js";

const router = express.Router();

router.delete("/:code", DELETE_TIMEKEEPING);
router.put("/:code", PUT_TIMEKEEPING);
router.post("/check-out", POST_TIMEKEEPING_CHECK_OUT);
router.post("/check-in", POST_TIMEKEEPING_CHECK_IN);
router.get("/:code", GET_TIMEKEEPING);
router.get("/", LIST_TIMEKEEPING);

export default router;
