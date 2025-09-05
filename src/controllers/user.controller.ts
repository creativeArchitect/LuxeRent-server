import User from "../models/user.model";
import AppError from "../utils/error.utils";
import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { getJWT, validatePassword } from "../middleware/auth.middleware";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as 'none' | 'lax',
  maxAge: 3 * 24 * 60 * 60 * 1000,
};
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !email || !password) {
      return next(new AppError("Please enter the required fields", 400));
    }

    const userExists = await User.findOne({ email: email });

    console.log("user: ", userExists);

    if (userExists) {
      return next(new AppError("User already exits", 400));
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const avatarPath: string =
      req.file?.filename !== undefined
        ? `/upload/users-data/${req.file?.filename}`
        : "/src/public/images/avatar-img.png";

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: passwordHash,
      avatarUrl: avatarPath,
    });

    user.password = "";

    const token = getJWT(user._id.toString());

    console.log("token in reg: ", token);

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "user registered successfully",
      token: token,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (err) {
    console.log("user registration error", err);
    return next(
      new AppError("Error in registration, please try again later.", 500)
    );
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    console.log("req.cookies", req.cookies);

    if (!email || !password) {
      return next(new AppError("Please enter the required fields", 400));
    }

    const user = await User.findOne({ email: email }).select("+password");
    if (!user) {
      return next(new AppError("User doesn't exists, please register", 400));
    }

    const isValid = await validatePassword(password, user.password);
    if (!isValid) {
      return next(new AppError("Invalid input creadentials", 400));
    }

    const token = getJWT(user._id.toString());
    console.log("token in login: ", token);

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "user loggedin successfully",
      token: token,
      id: user._id,
      email: user.email,
    });
  } catch (err) {
    next(new AppError("Error in login, please try again later.", 500));
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("token", {
      maxAge: 0,
      secure: true,
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "user loggedout successfully",
    });
  } catch (err) {
    return new AppError("Error in logout, please try again later.", 500);
  }
};
