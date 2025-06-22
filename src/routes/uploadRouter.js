import express from "express";
import { CheckAuth } from "../middlewares/AuthCheck.js";
import { GetUserImage } from "../controllers/uploadImageController.js";
import { multerUpload } from "../middlewares/upload.js";

export const uploadRouter = express.Router();

uploadRouter.get("/:userId", GetUserImage);
uploadRouter.post(
  "/upload",
  CheckAuth,
  multerUpload.single("upload"),
  GetUserImage
);
