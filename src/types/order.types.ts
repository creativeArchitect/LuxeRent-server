import type { Number, ObjectId } from "mongoose"


export type OrderStatus = "pending" | "ongoing" | "returned" | "late" | "cancelled";

export type ClothInfo = {
  clothId: ObjectId
  fromDate: Date
  toDate: Date
  totalPrice: number
}

type PaymentMethod = "COD" | "UPI"

export interface OrderType {
    user: ObjectId
    clothes: ClothInfo[]
    totalPrice: number
    status: OrderStatus
    paymentMethod: PaymentMethod
    shippingAddress: {
      firstName: string;
      lastName: string;
      address: string;
      city: string;
      state: string;
      pincode: string;
      phone: string;
    };
}



export interface OrderDocument extends OrderType, Document{}