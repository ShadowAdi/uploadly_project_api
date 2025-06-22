import { configDotenv } from "dotenv";

export const configEnvs = () => {
  configDotenv();
};

configEnvs()

export const PORT = process.env.PORT;
export const MONGODB_URL = process.env.MONGODB_URL;
export const JWT_SECRET_KEY=process.env.JWT_SECRET_KEY;
export const NSFW_API_USER=process.env.NSFW_API_USER
export const NSFW_API_SECRET=process.env.NSFW_API_SECRET
