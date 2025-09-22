import type { ObjectId } from "mongoose"


export type OrderStatus = "pending" | "ongoing" | "returned" | "late" | "cancelled";

export type ClothInfo = {
  id: ObjectId
  fromDate: Date
  toDate: Date
  totalPrice: Number
}

export interface OrderType {
    user: ObjectId
    clothes: ClothInfo[]
    orderDate: Date
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