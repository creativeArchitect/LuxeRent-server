import type { ObjectId } from "mongoose"


export type OrderStatus = "pending" | "ongoing" | "returned" | "late" | "cancelled";

export interface OrderType {
    user: ObjectId;
    cloth: ObjectId;
    startDate: Date
    endDate: Date
    totalPrice: Number
    status: OrderStatus
    shippingAddress: {
      fullName: string;
      address: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
      phone: string;
    };
}


export interface OrderDocument extends OrderType, Document{}