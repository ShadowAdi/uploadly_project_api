import path from "path";
import { UserModel } from "../models/UserSchema.js";
import { AppError } from "../utils/AppError.js";
import { CustomTryCatch } from "../utils/CustomTryCatch.js";
import { logger } from "../utils/logger.js";
import fs from "fs";
import { processAvatarImage } from "../utils/imageProcessor.js";

export const GetUserImage = CustomTryCatch(async (req, res, next) => {
  const { userId } = req.params;

  if (!userId) {
    logger.error(`User ID not provided.`);
    return next(new AppError("User ID is required", 400));
  }

  const user = await UserModel.findById(userId).select("avatar");

  if (!user) {
    logger.error(`User not found for ID: ${userId}`);
    return next(new AppError("User not found", 404));
  }

  if (user.avatar?.url) {
    return res.status(200).json({
      success: true,
      message: "Avatar found",
      url: user.avatar.url,
      uploadedAt: user.avatar.uploadedAt,
      filename: user.avatar.filename,
    });
  } else {
    return res.status(200).json({
      success: true,
      message: "No avatar uploaded, using default.",
      url: `${process.env.BASE_URL}/default.png`, // or null
    });
  }
});

export const UploadImage = CustomTryCatch(async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file provided." });
  }
  const user = req.user;
  if (!user) {
    logger.error(`Failed to get the authenticated user ${user}`);
    console.log(`Failed to get the authenticated user ${user}`);
    return next(
      new AppError(`Failed to get the authenticated user ${user}`, 404)
    );
  }
  const { email, sub } = user;
  if (!sub) {
    logger.error(`Failed to get the authenticated user ${sub}`);
    console.log(`Failed to get the authenticated user ${sub}`);
    return next(
      new AppError(`Failed to get the authenticated user ${sub}`, 404)
    );
  }
  const userFound = await UserModel.findById(sub).select("-password");
  if (!userFound) {
    logger.error(`User With Id Do Not Exist: ${sub}`);
    console.log(`User With Id Do Not Exist: ${sub}`);
    return next(new AppError(`User With Id Do Not Exist: ${sub}`, 404));
  }
  if (userFound.email !== email) {
    logger.error(`User With email Do Not Exist: ${email}`);
    console.log(`User With email Do Not Exist: ${email}`);
    return next(new AppError(`User With email Do Not Exist: ${email}`, 404));
  }

  const oldFileName = req.user.avatar?.filename;
  if (oldFileName) {
    const oldPath = path.join("uploads", "avatars", oldFileName);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
  }

  const { fileName, url } = await processAvatarImage(req.file.buffer, sub);
  userFound.avatar = {
    filename: fileName,
    url: url,
    uploadedAt: new Date(),
  };
  await userFound.save();
  return res.status(200).json({
    success: true,
    message: "Avatar uploaded successfully.",
    url,
  });
});
