import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/healthRouter";
import { configEnvs, PORT } from "./envs";
import { CustomErrorHandler } from "./middlewares/errorHandler";
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

app.use(CustomErrorHandler);

app.listen(PORT, () => {
  logger.info("Server Started at the port of " + PORT);
  console.log("Server Started");
});
