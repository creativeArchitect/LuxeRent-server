import mongoose from "mongoose";
import type { OrderDocument } from "../types/order.types";

const orderSchema = new mongoose.Schema<OrderDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    cloth: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Clothes",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["ongoing", "returned", "late"],
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model<OrderDocument>("Order", orderSchema);

export default Order;
