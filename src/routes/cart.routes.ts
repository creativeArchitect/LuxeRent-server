import { getCartItems, saveCartItems, updateCartItems } from "@/controllers/cart.controller";
import { isLoggedInUser } from "@/middleware/auth.middleware";
import { Router } from "express";

const cartRouter = Router();

cartRouter.post('/', isLoggedInUser, saveCartItems);
cartRouter.get('/', isLoggedInUser, getCartItems);
cartRouter.put('/', isLoggedInUser, updateCartItems);


export default cartRouter;