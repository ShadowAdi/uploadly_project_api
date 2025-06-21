import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/healthRouter";
import { configEnvs, PORT } from "./envs";
const app = express();
configEnvs();

app.use(cors());

app.use("/api/health", healthRouter);

app.listen(PORT, () => {
  console.log(`Server started at the port ${PORT}`);
});
