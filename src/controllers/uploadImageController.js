import path from "path";
import { UserModel } from "../models/UserSchema.js";
import { AppError } from "../utils/AppError.js";
import { CustomTryCatch } from "../utils/CustomTryCatch.js";
import { logger } from "../utils/logger.js";
import fs from "fs";
import { processAvatarImage } from "../utils/imageProcessor.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { isNsfw } from "../config/nsfw.js";
import { cloudinaryConfig } from "../config/cloudinary_config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

  // const oldFileName = req.user.avatar?.filename;
  // if (oldFileName) {
  //   const oldPath = path.join("uploads", "avatars", oldFileName);
  //   if (fs.existsSync(oldPath)) {
  //     fs.unlinkSync(oldPath);
  //   }
  // }

  try {
    const { buffer, mimetype, originalname } = req.file;
    await isNsfw(buffer, mimetype, originalname);
  } catch (err) {
    return next(new AppError("NSFW image detected. Upload denied.", 400));
  }

  try {
    if (userFound.avatar?.filename) {
      await cloudinaryConfig.uploader.destroy(userFound.avatar.filename);
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinaryConfig.uploader.upload_stream(
        {
          folder: `avatars/${sub}`,
          resource_type: "image",
          public_id: `avatar_${sub}_${Date.now()}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });
    userFound.avatar = {
      filename: uploadResult.public_id,
      url: uploadResult.secure_url,
      uploadedAt: new Date(),
    };
    await userFound.save();
    return res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully.",
      url: uploadResult.secure_url,
    });
  } catch (error) {
    logger.error(`Failed to upload image to Cloudinary: ${error.message}`);
    return next(new AppError("Failed to upload image", 500));
  }
});

export const DeleteImage = CustomTryCatch(async (req, res, next) => {
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
    logger.error(`User with ID does not exist: ${sub}`);
    return next(new AppError(`User with ID does not exist: ${sub}`, 404));
  }

  if (userFound.email !== email) {
    logger.error(`User with email does not exist: ${email}`);
    return next(new AppError(`User with email does not exist: ${email}`, 404));
  }

  const filename = userFound.avatar?.filename;
  if (!filename) {
    logger.info(`No avatar found for user: ${sub}`);
    return res.status(200).json({
      success: true,
      message: "No avatar to delete.",
      url: null,
    });
  }
  // const filePath = path.join(
  //   __dirname,
  //   "..",
  //   "..",
  //   "Uploads",
  //   "avatars",
  //   filename
  // );
  // console.log("Attempting to delete file:", filePath);

  // try {
  //   if (fs.existsSync(filePath)) {
  //     fs.unlinkSync(filePath);
  //     logger.info(`Deleted avatar file: ${filename}`);
  //   } else {
  //     logger.warn(`Avatar file not found: ${filePath}`);
  //   }
  // } catch (err) {
  //   logger.error(`Error deleting avatar file: ${err.message}`);
  //   return next(
  //     new AppError(`Failed to delete avatar file: ${err.message}`, 500)
  //   );
  // }

  try {
    await cloudinaryConfig.uploader.destroy(filename);
    logger.info(`Deleted avatar from Cloudinary: ${filename}`);
    userFound.avatar = {
      url: "",
      filename: "",
      uploadedAt: null,
    };
    await userFound.save();
    return res.status(200).json({
      success: true,
      message: "Avatar deleted successfully.",
      url: null,
    });
  } catch (error) {
     logger.error(`Error deleting avatar from Cloudinary: ${err.message}`);
    return next(
      new AppError(`Failed to delete avatar: ${err.message}`, 500)
    );
  }


});

export const UpdateImage = CustomTryCatch(async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file provided." });
  }
  const user = req.user;
  if (!user) {
    logger.error(`Failed to get the authenticated user ${user}`);
    return next(new AppError(`Failed to get the authenticated user`, 404));
  }
  const { email, sub } = user;
  if (!sub) {
    logger.error(`Failed to get the authenticated user ID ${sub}`);
    return next(new AppError(`Failed to get the authenticated user ID`, 404));
  }
  const userFound = await UserModel.findById(sub).select("-password");
  if (!userFound) {
    logger.error(`User with ID does not exist: ${sub}`);
    return next(new AppError(`User with ID does not exist: ${sub}`, 404));
  }
  if (userFound.email !== email) {
    logger.error(`User with email does not exist: ${email}`);
    return next(new AppError(`User with email does not exist: ${email}`, 404));
  }

  try {
    const { buffer, mimetype, originalname } = req.file;
    await isNsfw(buffer, mimetype, originalname);
  } catch (err) {
    return next(new AppError("NSFW image detected. Upload denied.", 400));
  }

  const oldFileName = userFound.avatar?.filename;
  if (oldFileName) {
    const oldPath = path.join(
      __dirname,
      "..",
      "..",
      "Uploads",
      "avatars",
      oldFileName
    );
    console.log("Attempting to delete old file:", oldPath);
    try {
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
        logger.info(`Deleted old avatar file: ${oldFileName}`);
      } else {
        logger.warn(`Old avatar file not found: ${oldPath}`);
      }
    } catch (err) {
      logger.error(`Error deleting old avatar file: ${err.message}`);
      return next(
        new AppError(`Failed to delete old avatar file: ${err.message}`, 500)
      );
    }
  }

  try {
    const { fileName, url } = await processAvatarImage(req.file.buffer, sub);
    userFound.avatar = {
      filename: fileName,
      url: url,
      uploadedAt: new Date(),
    };
    await userFound.save();
    return res.status(200).json({
      success: true,
      message: "Avatar updated successfully.",
      url,
    });
  } catch (err) {
    logger.error(`Failed to process new avatar image: ${err.message}`);
    return next(
      new AppError(`Failed to process new avatar image: ${err.message}`, 500)
    );
  }
});
