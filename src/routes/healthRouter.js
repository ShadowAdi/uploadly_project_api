import express from "express";
import { healthCheck } from "../controllers/healthController";

export const healthRouter = express.Router();

healthRouter.get("/", healthCheck);
