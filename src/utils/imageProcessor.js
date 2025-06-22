import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const processAvatarImage = async (buffer, userId) => {
  const fileName = `${userId}_${Date.now()}.png`;
  let fold1 = "Uploads";
  let fold2 = "avatars";
  const dir = path.join(__dirname, "..", "..", fold1, fold2);

  console.log("Target directory:", dir); // Log the directory path
  if (!fs.existsSync(dir)) {
    console.log("Creating directory:", dir);
    try {
      fs.mkdirSync(dir, { recursive: true });
      console.log("Directory created successfully");
    } catch (err) {
      console.error("Failed to create directory:", err.message);
      throw err;
    }
  }

  const outputPath = path.join(dir, fileName);
  console.log("Output path:", outputPath);
  const PORT = process.env.PORT;
  await sharp(buffer)
    .resize(256, 256, { fit: "cover" })
    .toFormat("png")
    .toFile(outputPath);
  return {
    fileName,
    url: `http://localhost:${PORT}/${fold1}/${fold2}/${fileName}`,
  };
};
