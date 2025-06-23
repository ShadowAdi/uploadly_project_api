import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { cloudinaryConfig } from "../config/cloudinary_config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const processAvatarImage = async (buffer, userId) => {
  const resizedBuffer = await sharp(buffer)
    .resize(256, 256, { fit: "cover" })
    .toFormat("png")
    .png({ quality: 90 })
    .toBuffer();

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinaryConfig.uploader.upload_stream(
      {
        folder: `avatars/${userId}`,
        resource_type: "image",
        public_id: `avatar_${userId}_${Date.now()}`,
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );

    stream.end(resizedBuffer);
  });

  return {
    fileName: result.public_id,
    url: result.secure_url,
  };
};
