import express from "express";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import { healthRouter } from "./routes/healthRouter.js";
import { configEnvs, PORT } from "./envs/index.js";
import { CustomErrorHandler } from "./middlewares/errorHandler.js";
import { DBConnect } from "./config/db.js";
import { userRouter } from "./routes/userRouter.js";
import { uploadRouter } from "./routes/uploadRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
configEnvs();

app.use(
  cors({
    allowedHeaders: true,
    methods: ["*"],
    origin: ["*"],
  })
);

app.use(express.json());

app.use(
  "/uploads/avatars",
  express.static(path.join(__dirname, "..", "uploads", "avatars"))
);

app.use("/api/health", healthRouter);
app.use("/api/user", userRouter);
app.use("/api/avatar", uploadRouter);

app.use(CustomErrorHandler);

try {
  await DBConnect();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (err) {
  console.error("Server failed to start due to DB error:", err.message);
  process.exit(1);
}
