import { Router } from "express";
import { isLoggedInUser } from "../middleware/auth.middleware";
import { getUserRentals, rentCloth, rentalsHistory, returnRentals } from "../controllers/order.controller";


const orderRouter = Router();

orderRouter.get('/my', isLoggedInUser, getUserRentals);

orderRouter.post('/', isLoggedInUser, rentCloth);
orderRouter.put('/return/:id', isLoggedInUser, returnRentals);


orderRouter.get('/all', rentalsHistory);

export default orderRouter;






