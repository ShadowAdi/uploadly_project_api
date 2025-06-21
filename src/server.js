import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/healthRouter.js";
import { configEnvs, PORT } from "./envs/index.js";
import { CustomErrorHandler } from "./middlewares/errorHandler.js";
import { DBConnect } from "./config/db.js";
import { userRouter } from "./routes/userRouter.js";
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

app.use("/api/health", healthRouter);
app.use("/api/user", userRouter);

app.use(CustomErrorHandler);

app.listen(PORT, () => {
  DBConnect();
  logger.info("Server Started at the port of " + PORT);
  console.log("Server Started");
});
