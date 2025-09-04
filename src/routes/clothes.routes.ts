import { Router } from "express";
import {
  addCloth,
  deleteCloth,
  getAllClothes,
  getCloth,
  updateCloth,
} from "../controllers/clothes.controller";
import { isLoggedInUser } from "../middleware/auth.middleware";
import upload from "../middleware/upload.middleware";

const clothesRouter = Router();

clothesRouter.get("/all", getAllClothes);
clothesRouter.get("/:id", getCloth);

// clothesRouter.post(
//   "/",
//   isLoggedInUser,
//   upload.array("images", 5),
//   addCloth
// );

// clothesRouter.put(
//   "/:id",
//   upload.array("images", 5),
//   isLoggedInUser,
//   updateCloth
// );

//  beta version having only one cloth image

clothesRouter.post(
  "/",
  isLoggedInUser,
  upload.single("image"),
  addCloth
);

clothesRouter.put(
  "/:id",
  upload.array("image"),
  isLoggedInUser,
  updateCloth
);
clothesRouter.delete("/:id", isLoggedInUser, deleteCloth);

export default clothesRouter;
