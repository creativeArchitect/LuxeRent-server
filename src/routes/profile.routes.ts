import { Router } from "express";
import { isLoggedInUser } from "../middleware/auth.middleware"
import { deleteProfile, getProfile, updateProfile } from "../controllers/profile.controller";
import upload from "../middleware/upload.middleware";
const profileRouter = Router();

profileRouter.get('/me', isLoggedInUser, getProfile);
profileRouter.put('/me', isLoggedInUser, upload.single('image'), updateProfile);
profileRouter.delete('/me', isLoggedInUser, deleteProfile);

export default profileRouter;


