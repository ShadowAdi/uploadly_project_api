import express from "express";
import { LoginUser, RegisterUser } from "../controllers/userController";

export const userRouter = express.Router();

userRouter.post("/register", RegisterUser);
userRouter.post("/login", LoginUser);
