import { deleteCartItems, getCartItems, saveCartItems } from "@/controllers/cart.controller";
import { isLoggedInUser } from "@/middleware/auth.middleware";
import { Router } from "express";

const cartRouter = Router();

cartRouter.post('/', isLoggedInUser, saveCartItems);
cartRouter.get('/', isLoggedInUser, getCartItems);
// cartRouter.put('/', isLoggedInUser, updateCartItems);
cartRouter.delete('/:id', isLoggedInUser, deleteCartItems);


export default cartRouter;