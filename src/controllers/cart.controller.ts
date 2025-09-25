import Cart from "@/models/cart.model";
import Clothes from "@/models/clothes.model";
import User from "@/models/user.model";
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
    if (!clothId || !startDate || !endDate || !totalPrice || !totalDays) {
      return next(new AppError("Cloth information is not present.", 400));
    }

    const cloth = await Clothes.findById(clothId);
    if (cloth) {
      return next(new AppError("cloth is already present", 404));
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

    const cartItems = await Cart.find({ userId: user._id });
    if(cartItems.length <= 0){
        return res.status(200).json({
            success: false,
            message: "Cart is Empty",
          });
    }

    return res.status(200).json({
      success: false,
      message: "Cart is empty",
      cart: cartItems
    });
  } catch (err) {
    console.log("error in saving cart items");
    return new AppError("Error in saving cart items", 500);
  }
};

// export const updateCartItems = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const user = req.user;
//     if (!user) {
//       return next(new AppError("user doesn't exits, please login", 401));
//     }

//     const { clothId, startDate, endDate, totalDays, totalPrice } = req.body;
//     if(!clothId){
//       return res.status(400).json({
//         success: false,
//         message: "cloth id is not exists"
//       })
//     }

//     const cloth = await Clothes.findById(clothId);
//     if (!cloth) {
//       return next(new AppError("cloth is not found", 404));
//     }


//     const updatedCart = await Cart.find({ userId: user._id });

//     if(updatedCart.length <= 0){

//     }

//     // const updatedItems = user.cartItems > 0 && user.cartItems.map(i=> i.clothId === clothId ? { ...i, startDate: startDate, endDate: endDate, totalDays: totalDays,totalPrice: totalPrice } : i );

//     await User.findByIdAndUpdate(user._id, {
//         cartItems: updatedItems
//     })


//     res.status(200).json({
//         success: true,
//         message: "Cart data updated successfully"
//     })
//   } catch (err) {
//     console.log("error in saving cart items");
//     return new AppError("Error in saving cart items", 500);
//   }
// };

export const deleteCartItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new AppError("user doesn't exits, please login", 401));
    }

    const { clothId } = req.body;
    if(!clothId){
      return res.status(400).json({
        success: false,
        message: "cloth Id not exits"
      })
    }

    const isClothExits = await Clothes.findById(clothId);
    if(!isClothExits){
      return res.status(400).json({
        success: false,
        message: "cloth is not exits"
      })
    }

    const updatedItems = await Cart.findOneAndDelete({ clothId: clothId });

    res.status(200).json({
        success: true,
        message: "Cart data deleted successfully",
        updatedItems
    })
  } catch (err) {
    console.log("error in deleting cart item");
    // return new AppError("Error in deleting cart item", 500);

    return res.status(500).json({
      success: true,
      message: "Error in deleting cart item" 
    });
  }
};