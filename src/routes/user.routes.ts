import { Router } from "express";
import { login, logout, register } from "../controllers/user.controller";
import upload from "../middleware/upload.middleware";

const userRouter = Router();

userRouter.post('/register', upload.single('image'), register);
userRouter.post('/login', login);
userRouter.post('/logout', logout);


export default userRouter;

