import express from "express";
import { CheckAuth } from "../middlewares/AuthCheck.js";
import {
  DeleteImage,
  GetUserImage,
  UpdateImage,
  UploadImage,
} from "../controllers/uploadImageController.js";
import { handleMulterErrors, multerUpload } from "../middlewares/upload.js";
import { expressRateLimiter } from "../middlewares/uploadRateLimiter.js";

export const uploadRouter = express.Router();

uploadRouter.get("/user-profile/:userId", GetUserImage);
uploadRouter.post(
  "/upload",
  CheckAuth,
  expressRateLimiter,
  multerUpload.single("upload"),
  handleMulterErrors,
  UploadImage
);
uploadRouter.put(
  "/upload",
  CheckAuth,
  multerUpload.single("upload"),
  handleMulterErrors,
  UpdateImage
);
uploadRouter.delete("/upload", CheckAuth, DeleteImage);
