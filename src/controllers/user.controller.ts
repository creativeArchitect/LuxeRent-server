import User from "../models/user.model";
import AppError from "../utils/error.utils";
import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { getJWT, validatePassword } from "../middleware/auth.middleware";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as
    | "none"
    | "lax",
  maxAge: 3 * 24 * 60 * 60 * 1000,
};
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    console.log("req.body: ", req.body);

    if (!firstName || !email || !password) {
      // return next(new AppError("Please enter the required fields", 400));
      return res.status(400).json({
        success: false,
        message: "Please enter the required fields"
      })
    }

    const userExists = await User.findOne({ email: email });

    if (userExists) {
      // return next(new AppError("User already exits", 400));
      return res.status(400).json({
        success: false,
        message: "User already exits, Please login."
      })
    }

    const passwordHash = await bcrypt.hash(password, 10);
    console.log("passwordhash: ", passwordHash);
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

    console.log("User details: ", user);

    user.password = "";

    const token = getJWT(user._id.toString());

    // res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "user registered successfully",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarURL: user.avatarUrl,
        role: user.role
      },
      token: token,
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
    console.log("req.body: ", req.body);

    if (!email || !password) {
      // return next(new AppError("Please enter the required fields", 400));
      return res.status(400).json({
        success: false,
        message: "Please enter the required fields"
      })
    }

    const user = await User.findOne({ email: email }).select("+password");
    console.log("user: ", user);
    if (!user) {
     return res.status(400).send({
        success: false,
        message: "User doesn't exists, please register"
      });
    }

    const isValid = await validatePassword(password, user.password);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      })
    }

    const token = getJWT(user._id.toString());

    // res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "user loggedin successfully",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarURL: user.avatarUrl,
        role: user.role
      },
      token: token,
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
    // res.clearCookie("token", {
    //   maxAge: 0,
    //   secure: true,
    //   httpOnly: true,
    // });

    res.status(200).json({
      success: true,
      message: "user loggedout successfully",
    });
  } catch (err) {
    return new AppError("Error in logout, please try again later.", 500);
  }
};
