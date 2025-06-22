import express from "express";
import { CheckAuth } from "../middlewares/AuthCheck.js";
import { GetUserImage } from "../controllers/uploadImageController.js";


export const uploadRouter=express.Router();

uploadRouter.get("/:userId",GetUserImage)