import type { ObjectId } from "mongoose"
import { CartTypes } from "./cart.types"

export interface UserType {
    id?: ObjectId
    firstName: string
    lastName?: string
    email: string
    password: string
    avatarUrl?: string
    role?: "owner" | "user"
    rentals?: [String]
    defaultAddress?: {
        address: String,
        city: String,
        state: String,
        pincode: String,
        country: String,
        phone: String
      },
}

export interface UserDocument extends UserType, Document {}