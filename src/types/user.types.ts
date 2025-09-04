import type { ObjectId } from "mongoose"

export interface UserType {
    id?: ObjectId
    firstName: string
    lastName?: string
    email: string
    password: string
    avatarUrl?: string
    role?: "owner" | "user"
    rentals?: [String]
}

export interface UserDocument extends UserType, Document {}