import mongoose from "mongoose";
import { logger } from "../utils/logger.js";
import { AppError } from "../utils/AppError.js";
import { MONGODB_URL } from "../envs/index.js";

export const DBConnect = async () => {
  if (!MONGODB_URL) {
    console.error("MongoDB URL is missing");
    logger.error("MongoDB URL is missing");
    throw new AppError("Internal Server Error - MongoDB URL is undefined", 500);
  }

  try {
    await mongoose.connect(MONGODB_URL);
    logger.info("Database Connected");
  } catch (err) {
    console.error("Failed to connect to the database", err);
    logger.error("Failed to connect to the database: " + err.message);
    throw new AppError("Database connection failed", 500);
  }
};
