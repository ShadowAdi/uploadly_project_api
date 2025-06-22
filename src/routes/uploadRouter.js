import express from "express";
import { CheckAuth } from "../middlewares/AuthCheck.js";
import {
  DeleteImage,
  GetUserImage,
  UpdateImage,
  UploadImage,
} from "../controllers/uploadImageController.js";
import { multerUpload } from "../middlewares/upload.js";
import expressRateLimiter from "express-rate-limiter";

export const uploadRouter = express.Router();

uploadRouter.get("/user-profile/:userId", GetUserImage);
uploadRouter.post(
  "/upload",
  CheckAuth,
  // expressRateLimiter,
  multerUpload.single("upload"),
  UploadImage
);
uploadRouter.put(
  "/upload",
  CheckAuth,
  multerUpload.single("upload"),
  UpdateImage
);
uploadRouter.delete("/upload", CheckAuth, DeleteImage);
