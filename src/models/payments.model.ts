import { PaymentType } from "@/types/payment.types";
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema<PaymentType>({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    orderId: {
        type: mongoose.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    razorpay_order_id: {
        type: String,
        ref: 'Order',
        required: true
    },
    razorpay_payment_id: {
        type: String,
        ref: 'Order',
        required: true
    },
    razorpay_signature: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["success", "pending", "failure"],
        required: true
    }
}, { timestamps: true });

const Payment = mongoose.model<PaymentType>('Payment', paymentSchema);

export default Payment;