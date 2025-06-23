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

  const publicId = `avatar_${userId}_${Date.now()}_${uuidv4()}`;

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinaryConfig.uploader.upload_stream(
      {
        folder: `avatars/${userId}`,
        public_id: publicId,
        resource_type: "image",
        format: "png",
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
