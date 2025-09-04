import type { ObjectId } from "mongoose"


export interface OrderType {
    user: ObjectId;
    cloth: ObjectId;
    startDate: Date
    endDate: Date
    totalPrice: Number
    status: "ongoing" | "returned" | "late"
}


export interface OrderDocument extends OrderType, Document{}