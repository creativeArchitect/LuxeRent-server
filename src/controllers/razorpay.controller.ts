import AppError from "@/utils/error.utils";
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import Payment from "@/models/payments.model";
import Clothes from "@/models/clothes.model";
import Order from "@/models/order.model";
import { RentClothType } from "@/types/cloth.types";
import mongoose from "mongoose";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { amount, currency = "INR", orderId } = req.body;

    const option = {
      amount: amount * 100,
      currency,
      receipt: req.user?._id.toString(),
    };

    const order = await razorpay.orders.create(option);

    console.log("order details after order creation: ", order);

    const payment = await Payment.create({
      userId: req.user?._id,
      orderId,
      razorpay_order_id: order.id,
      status: "pending",
    });

    res.status(200).json({
      success: true,
      message: "order creation intiatiated successfully.",
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (err) {
    console.log("Error in the payment order creation", err);
    return next(new AppError("Error in the payment creation", 500));
  }
};

export const verifyOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!);

    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);

    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return next(new AppError("Invalid signature", 400));
    }

    const updatedPayment = await Payment.findOneAndUpdate(
      {
        razorpay_order_id,
        userId: req.user._id,
      },
      {
        razorpay_payment_id,
        razorpay_signature,
        status: "success",
      },
      { new: true }
    );
    
    const orderId = req.body.orderId;
    if(!orderId){
      return next(new AppError("invalid order id", 400));
    }

    const clothesArr: RentClothType[] = req.body.clothes;
    if(clothesArr.length <= 0){
      return next(new AppError("No clothes found, please add clothes", 400));
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try{
      await Promise.all(clothesArr.map(async (c)=> {
        const cloth = await Clothes.findById(c.clothId);
        if (!cloth) {
          return next(new AppError("cloth is not present", 404));
        }else{
          await Clothes.findByIdAndUpdate(c.clothId, { available: false });
        }
      }))
  
      await Order.findByIdAndUpdate(orderId, {
        status: "ongoing"
      });

      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      return next(new AppError("Transaction failed", 500));
    } finally {
      session.endSession();
    }

    res.status(200).json({
      success: true,
      message: "Payment verified",
      payment: updatedPayment
    });
  } catch (err) {
    console.error("Payment verification error:", err);
    return next(new AppError("payment verification error", 500));
  }
};
