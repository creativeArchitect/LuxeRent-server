import { ObjectId } from "mongoose"


export type PaymentStatus = "success" | "pending" | "failure"

export interface PaymentType {
    userId: ObjectId,
    orderId: ObjectId,
    razorpay_order_id: string,
    razorpay_payment_id?: string,
    razorpay_signature?: string,
    status: PaymentStatus
}