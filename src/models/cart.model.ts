import { CartTypes } from "@/types/cart.types";
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema<CartTypes>({
  clothId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  totalDays: {
    type: Number,
  },
  totalPrice: {
    type: Number,
  },
});

const Cart = mongoose.model<CartTypes>("Cart", cartSchema);

export default Cart;
