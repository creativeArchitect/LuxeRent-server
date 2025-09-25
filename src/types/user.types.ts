import type { ObjectId } from "mongoose"
import { CartTypes } from "./cart.types"

// type UserCart = {
//   clothId: ObjectId
//   fromDate: Date
//   toDate: Date
//   totalDays?: Number
//   totalPrice?: Number
// }

export interface UserType {
    id?: ObjectId
    firstName: string
    lastName?: string
    email: string
    password: string
    avatarUrl?: string  
    role?: "owner" | "user"
    rentals?: [String]
    // cartItems: UserCart[]
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