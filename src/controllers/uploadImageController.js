import { UserModel } from "../models/UserSchema";
import { AppError } from "../utils/AppError";
import { CustomTryCatch } from "../utils/CustomTryCatch";
import { logger } from "../utils/logger";

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
