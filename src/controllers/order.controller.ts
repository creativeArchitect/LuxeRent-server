import type { Request, Response, NextFunction } from "express";
import AppError from "../utils/error.utils";
import Order from "../models/order.model";
import Clothes from "../models/clothes.model";

export const getUserRentals = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new AppError("user doesn't exits, please login", 404));
    }

    console.log("user: ", user);
    const userRentals = await Order.find({ user: user._id }).populate("cloth");

    console.log("user rentals: ", userRentals)

    if (userRentals.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No rental clothes data exits",
        orders: userRentals,
      });
    }

    res.status(200).json({
      success: true,
      message: "Rentals fetched successfully.",
      orders: userRentals,
    });
  } catch (err) {
    console.log("Error in fetching user rentals");
    return next(new AppError("Error in fetching rentals", 500));
  }
};

export const rentCloth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new AppError("user doesn't exits, please login", 404));
    }

    const clothId = req.body.clothId;
    if (!clothId) {
      return next(new AppError("cloth is not exits", 400));
    }

    const cloth = await Clothes.findById(clothId);
    if (!cloth) {
      return next(new AppError("cloth is not present", 404));
    }

    const { startDate, endDate } = req.body;
    if (new Date(endDate) <= new Date(startDate)) {
      return next(new AppError("End date must be after start date", 400));
    }

    if (cloth.available === false) {
      return next(
        new AppError(
          "cloth is not available for rent, you can rent when it will available",
          404
        )
      );
    }

    const days = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const totalPrice = days * cloth.pricePerDay;

    const orderDetails = {
      user: user._id,
      cloth: clothId,
      startDate: startDate,
      endDate: endDate,
      totalPrice: totalPrice,
      status: "ongoing",
    };

    const order = await Order.create(orderDetails);

    await Clothes.findByIdAndUpdate(clothId, { available: false });

    res.status(200).json({
      success: true,
      message: "cloth fetched successfully.",
      order,
    });
  } catch (err) {
    console.log("on rent cloth error");
    return next(new AppError("Error in renting clothes", 500));
  }
};

export const returnRentals = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new AppError("user doesn't exits, please login", 404));
    }

    const clothId = req.params.id;
    if (!clothId) {
      return next(new AppError("Cloth is not present", 400));
    }

    const cloth = await Clothes.findById(clothId);
    console.log("cloth: ", cloth);
    if (!cloth) {
      return next(new AppError("cloth is not present", 404));
    }

    const order = await Order.findOneAndUpdate(
      {
        user: user._id,
        cloth: clothId,
        $or: [{ status: "ongoing" }, { status: "late" }],
      },
      { status: "returned" },
      { new: true }
    );
    if (!order) {
      return next(new AppError("No ongoing rental found for this cloth.", 404));
    }

    cloth.available = true;
    await cloth.save();

    res.status(200).json({
      success: true,
      message: "cloth returned successfully.",
      order,
    });
  } catch (err) {
    console.log("error in return rentals");
    return next(new AppError("Error in fetching ordered clothes history", 500));
  }
};

export const rentalsHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new AppError("user doesn't exits, please login", 404));
    }

    if (user?.role !== "admin") {
      return next(new AppError("Invalid action. Admin only", 403));
    }

    const clothesHistory = await Order.find({}).populate("user cloth");
    if (clothesHistory.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No rented history of clothes",
        clothesHistory,
      });
    }

    res.status(200).json({
      success: true,
      message: "clothes history fetched successfully.",
      clothesHistory,
    });
  } catch (err) {
    console.log("error in rental histroy fetching");
    return next(new AppError("Error in fetching ordered clothes history", 500));
  }
};
