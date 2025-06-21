import express from "express";
import { RegisterUser } from "../controllers/userController";

export const userRouter = express.Router();

userRouter.post("/register", RegisterUser);
