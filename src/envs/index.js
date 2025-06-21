import { configDotenv } from "dotenv";

export const configEnvs = () => {
  configDotenv();
};

export const PORT = process.env.PORT;
export const MONGODB_URL = process.env.MONGODB_URL;
export const JWT_SECRET_KEY=process.env.JWT_SECRET_KEY;