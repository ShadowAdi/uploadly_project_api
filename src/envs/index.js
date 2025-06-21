import { configDotenv } from "dotenv";

export const configEnvs = () => {
  configDotenv();
};

export const PORT = process.env.PORT;
export const MONGODB_URL = process.env.MONGODB_URL;
