import type { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import AppError from "../utils/error.utils";
import bcrypt from "bcrypt";

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(200).json({
        success: true,
        message: "user is not exists, Please register.",
      });
    }

    res.status(200).json({
      success: true,
      message: "user profile fetched successfully.",
      user,
    });
  } catch (err) {
    console.log("Error in getting the profile");
    return next(new AppError("Error in getting the profile", 500));
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { firstName, lastName, email, password } = req.body;

    const avatarPath: string =
      req.file?.filename !== undefined
        ? `/upload/users-data/${req.file?.filename}`
        : user.avatarUrl;

    const passwordHash = password
      ? await bcrypt.hash(password, 10)
      : user.password;

    const updatedUserDetails = {
      firstName: firstName ?? user.firstName,
      lastName: lastName ?? user.lastName,
      email: email ?? user.email,
      password: passwordHash,
      avatarUrl: avatarPath ? avatarPath : user.avatarUrl,
    };

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      updatedUserDetails,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: {
        id: updatedUser?._id,
        firstName: updatedUser?.firstName,
        lastName: updatedUser?.lastName,
        email: updatedUser?.email,
    }});
  } catch (err) {
    console.log("Error in updating the profile");
    return next(new AppError("Error in updating the profile", 500));
  }
};

export const deleteProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    await User.findByIdAndDelete(user._id);

    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "user profile deleted successfully",
    });
  } catch (err) {
    console.log("Error in deleting the profile");
    return next(new AppError("Error in deleting the profile", 500));
  }
};
