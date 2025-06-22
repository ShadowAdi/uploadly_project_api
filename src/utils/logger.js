import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf, colorize } = format;
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, "..", "..", "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

export const logger = createLogger({
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
  transports: [
    new transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
    new transports.File({
      filename: path.join(logDir, "warn.log"),
      level: "warn",
    }),
    new transports.File({
      filename: path.join(logDir, "info.log"),
      level: "info",
    }),
    new transports.Console({
      format: combine(colorize(), timestamp(), logFormat),
    }),
  ],
});
