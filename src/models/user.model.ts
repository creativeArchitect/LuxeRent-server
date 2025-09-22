import mongoose from "mongoose";
import validator from 'validator';
import type { UserDocument } from "../types/user.types";
import { CartTypes } from "@/types/cart.types";

const userSchema = new mongoose.Schema<UserDocument>({
    firstName: {
        type: String, 
        minLength: [3, "First Name having atleast 3 characters."],
        maxLength: [50, "First Name having atmost 50 characters."],
        trim: true,
        required: true
    },
    lastName: {
        type: String, 
        maxLength: [50, "Last Name having atmost 50 characters."],
        trim: true
    },
    email: {
        type: String, 
        trim: true,
        required: true,
        unique: true,
        validate: (val: string)=> {
            if(!validator.isEmail(val)){
                throw new Error("Please enter a valid email");
            }
        }
    },
    password: {
        type: String, 
        trim: true,
        required: true,
        select: false,
        validate: (val: string)=> {
            if(!validator.isStrongPassword(val)){
                throw new Error("Password must be strong (min 8 characters, including uppercase, lowercase, number, and symbol)");
            }
        }
    },
    avatarUrl: {
        type: String,
        default: '/src/public/images/avatar-img.png',
        trim: true
    },
    role: {
        type: String,
        enum: ["owner", "user"],
        default: "user"
    },    
    rentals: {
        type: [String],
        default: []
    }
}, { timestamps: true })


const User = mongoose.model<UserDocument>("User", userSchema);


export default User;

