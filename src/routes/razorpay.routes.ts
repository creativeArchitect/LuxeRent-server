import { createOrder, verifyOrder } from "@/controllers/razorpay.controller";
import { isLoggedInUser } from "@/middleware/auth.middleware";
import { Router } from "express";

const paymentRouter = Router();


paymentRouter.post('/create-order', isLoggedInUser, createOrder);

paymentRouter.post('/verify-order', isLoggedInUser, verifyOrder);



export default paymentRouter;