import bcrypt from "bcrypt";
import { UserModel } from "../models/UserSchema";
import { logger } from "../utils/logger";
import { CustomTryCatch } from "../utils/CustomTryCatch";
import { AppError } from "../utils/AppError";


export const RegisterUser = CustomTryCatch(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    logger.error(
      "Fields are not provided email: " +
        email +
        " and password is: " +
        password
    );
    return next(
      new AppError(
        `Required Data is not present Email:${email},password:${password}`,
        404
      )
    );
  }
  const isUserExist = await UserModel.findOne({ email });

  if (isUserExist) {
    logger.error(`User already exists with the mail: ${email}`);
    return next(
      new AppError(`User already exists with the mail: ${email}`, 404)
    );
  }
  const hashedPassword = bcrypt.hash(password, 10);
  const newUser = await UserModel({ email, password: hashedPassword });
  await newUser.save();
  logger.info("User is created");
  return res.status(201).json({
    statusCode: 201,
    message: "User is created",
    success: true,
  });
});
