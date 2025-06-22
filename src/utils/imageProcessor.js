import path from "path";
import sharp from "sharp";
export const processAvatarImage = async (buffer, userId) => {
  const fileName = `${userId}_${Date.now()}.png`;
  const outputPath = path.join("uploads", "avatars", fileName);
  await sharp(buffer)
    .resize(256, 256, { fit: "cover" })
    .toFormat("png")
    .toFile(outputPath);
  return { fileName, url: `/uploads/avatars/${fileName}` };
};
