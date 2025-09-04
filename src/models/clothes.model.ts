import mongoose from "mongoose";
import type { ClothDocument } from "../types/cloth.types";
import User from "./user.model";

const clotheSchema = new mongoose.Schema<ClothDocument>({
  name: {
    type: String,
    min: [3, "cloth-name must having atleast 3 characters."],
    max: [50, "cloth-name must having atleast 50 characters."],
    required: true,
    trim: true,
  },
  description: {
    type: String,
    min: [3, "cloth description must having atleast 3 characters."],
    max: [50, "cloth description  must having atleast 50 characters."],
    required: true,
    trim: true,
  },
  category: {
    type: String,
    min: [3, "cloth category must having atleast 3 characters."],
    max: [50, "cloth category must having atleast 50 characters."],
    required: true,
    trim: true,
  },
  pricePerDay: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    enum: ["S", "M", "L"],
    required: true,
  },
  // images: {
  //   type: [String],
  //   required: true,
  // },
  image: {
    type: String,
    required: true,
  },
  available: {
    type: Boolean,
    required: true,
  },
  currentRental: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

const Clothes = mongoose.model<ClothDocument>("Clothes", clotheSchema);

export default Clothes;
