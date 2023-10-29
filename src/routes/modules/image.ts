import express, { Request, Response } from "express";
import {
  GET_IMAGE,
  POST_IMAGE,
  PUT_IMAGE,
  DELETE_IMAGE,
} from "../../controllers/ImageController ";
import { uploads, uploadMultiple } from "../../middlewares/uploadMulter";

const router = express.Router();

router.delete("/image:id", DELETE_IMAGE);
router.put("/image:id", PUT_IMAGE);
router.post("/image", uploads.single("path"), POST_IMAGE);
router.get("/image", GET_IMAGE);

export default router;
