import bcrypt from "bcrypt";
import { UserModel } from "../models/UserSchema";
import { logger } from "../utils/logger";
import { CustomTryCatch } from "../utils/CustomTryCatch";
import { AppError } from "../utils/AppError";
import { TokenGenerator } from "../utils/TokenGenerator";

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

export const LoginUser = CustomTryCatch(async (req, res, next) => {
  const data = req.body;
  const { email, password } = data;
  if (!email || !password) {
    logger.error(
      `Required Data is not present Email:${email}, password:${password}, `
    );
    console.log(
      `Required Data is not present Email:${email}, password:${password}`
    );
    return next(
      new AppError(
        `Required Data is not present Email:${email}, password:${password}`,
        404
      )
    );
  }
  const isUserExist = await UserModel.findOne({ email });
  if (!isUserExist) {
    logger.error(`Failed to get user with email: ${email}`);
    return next(
      new AppError(`Failed to get the user with the email: ${email}`, 404)
    );
  }
  const isPasswordCorrect = bcrypt.compare(password, isUserExist.password);
  if (!isPasswordCorrect) {
    logger.error(
      `Invalid Credentails email: ${email} and password: ${password}`
    );
    return next(
      new AppError(
        `Invalid Credentails email: ${email} and password: ${password}`,
        404
      )
    );
  }
  const payload = {
    email: isUserExist.email,
    sub: isUserExist._id,
  };
  const token =await TokenGenerator(payload);
  return res.status(200).json({
    success: true,
    statusCode: 200,
    user: isUserExist,
    token,
  });
});