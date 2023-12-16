import express from "express";
import {
  GET_IMAGE,
  POST_IMAGE,
  PUT_IMAGE,
  DELETE_IMAGE,
} from "../../controllers/ImageController.js";
import { uploads, uploadMultiple } from "../../middlewares/uploadMulter.js";

const router = express.Router();

router.delete("/image/:code", DELETE_IMAGE);
router.put("/image/:code", PUT_IMAGE);
router.post("/image", uploads.single("image"), POST_IMAGE);
router.get("/image", GET_IMAGE);

export default router;
