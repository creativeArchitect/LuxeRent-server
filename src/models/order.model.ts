import mongoose from "mongoose";
import type { OrderDocument } from "../types/order.types";

const orderSchema = new mongoose.Schema<OrderDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    clothes: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "cloth",
      },
      fromDate: {
        type: Date,
        required: true,
      },
      toDate: {
        type: Date,
        required: true,
      },
      totalPrice: {
        type: Number,
        required: true,
      },
    },
    orderDate: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "ongoing", "returned", "late", "cancelled"],
      default: "pending",
    },
    shippingAddress: {
      firstName: {
        type: String,
        minLength: [3, "First Name having atleast 3 characters."],
        maxLength: [50, "First Name having atmost 50 characters."],
        trim: true,
        required: true,
      },
      lastName: {
        type: String,
        maxLength: [50, "Last Name having atmost 50 characters."],
        trim: true,
        required: true,
      },
      address: {
        type: String,
        minLength: [10, "First Name having atleast 10 characters."],
        maxLength: [100, "Last Name having atmost 100 characters."],
        trim: true,
        required: true,
      },
      city: {
        type: String,
        minLength: [3, "First Name having atleast 10 characters."],
        maxLength: [100, "Last Name having atmost 100 characters."],
        trim: true,
        required: true,
      },
      state: {
        type: String,
        minLength: [3, "First Name having atleast 10 characters."],
        maxLength: [100, "Last Name having atmost 100 characters."],
        trim: true,
        required: true,
      },
      pincode: {
        type: Number,
        trim: true,
        required: true,
      },
      phone: {
        type: Number,
        min: [10, "First Name having atleast 10 characters."],
        max: [10, "Last Name having atmost 10 characters."],
        trim: true,
        required: true,
      },
    },
  },
  { timestamps: true }
);

const Order = mongoose.model<OrderDocument>("Order", orderSchema);

export default Order;
