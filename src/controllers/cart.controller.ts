import Cart from "@/models/cart.model";
import Clothes from "@/models/clothes.model";
import User from "@/models/user.model";
import { CartTypes } from "@/types/cart.types";
import { ClothTypes } from "@/types/cloth.types";
import AppError from "@/utils/error.utils";
import { Request, Response, NextFunction } from "express";

export const saveCartItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new AppError("user doesn't exits, please login", 401));
    }

    const { clothId, startDate, endDate, totalPrice, totalDays } = req.body;
    if (!clothId) {
      return next(new AppError("cloth is not exits", 400));
    }

    const cloth = await Clothes.findById(clothId);
    if (!cloth) {
      return next(new AppError("cloth is not present", 404));
    }

    const cart = await Cart.create({
      clothId,
      userId: user._id,
      startDate,
      endDate,
      totalDays,
      totalPrice,
    });

    res.status(200).json({
      success: true,
      message: "Cart items fetch successfully",
      cart,
    });
  } catch (err) {
    console.log("error in saving cart items");
    return new AppError("Error in saving cart items", 500);
  }
};

export const getCartItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new AppError("user doesn't exits, please login", 401));
    }

    const cartItems: CartTypes[] = Cart.find({ userId: user._id });
    if(!cartItems){
        return res.status(200).json({
            success: false,
            message: "card",
          });
    }
    if (cartItems.length === 0) {
      return res.status(200).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let clothes: ClothTypes[] = [];
    for(let i=0; i<cartItems.length; i++){
        clothes.push(Clothes.findById(cartItems[i]));
    }



    return res.status(200).json({
      success: false,
      message: "Cart is empty",
      cartItems,
    });
  } catch (err) {
    console.log("error in saving cart items");
    return new AppError("Error in saving cart items", 500);
  }
};

export const updateCartItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new AppError("user doesn't exits, please login", 401));
    }

    const { clothId, startDate, endDate, totalDays, totalPrice } = req.body;

    const updatedItems = user.cartItems> 0 && user.cartItems.map(i=> i.clothId === clothId ? { ...i, startDate: startDate, endDate: endDate, totalDays: totalDays,totalPrice: totalPrice } : i );

    await User.findByIdAndUpdate(user._id, {
        cartItems: updatedItems
    })


    res.status(200).json({
        success: true,
        message: "Cart data updated successfully"
    })
  } catch (err) {
    console.log("error in saving cart items");
    return new AppError("Error in saving cart items", 500);
  }
};
