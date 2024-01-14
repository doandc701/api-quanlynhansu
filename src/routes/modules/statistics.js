import express from "express";

import { LIST_STATISTIC } from "../../controllers/StatisticController.js";

const router = express.Router();

router.get("/", LIST_STATISTIC);

export default router;
