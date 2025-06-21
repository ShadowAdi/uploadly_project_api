import express from "express";
import {
  AuthenticatedUser,
  LoginUser,
  RegisterUser,
} from "../controllers/userController";
import { CheckAuth } from "../middlewares/AuthCheck";

export const userRouter = express.Router();

userRouter.post("/register", RegisterUser);
userRouter.post("/login", LoginUser);
userRouter.post("/me", CheckAuth, AuthenticatedUser);
