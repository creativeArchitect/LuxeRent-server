import User from "../models/user.model";
import AppError from "../utils/error.utils"
import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { getJWT, validatePassword } from "../middleware/auth.middleware";


const cookieOptions = {
    maxAge: 3*24*60*60*1000,
    secure: true,
    httpOnly: true
}

export const register = async (req: Request, res: Response, next: NextFunction)=> {
    try{
        const { firstName, lastName, email, password } = req.body;

        if(!firstName || !email || !password){
            return next(new AppError("Please enter the required fields", 400));
        }

        let avatarPath: string = `/upload/users-data/${req.file?.filename}`;

        const userExists = await User.findOne({ email: email });

        if(userExists){
            return next(new AppError("User already exits", 400));
        }

        const passwordHash = await bcrypt.hash(password, 10);

        console.log("hash ", passwordHash)

        const user = await User.create({
            firstName, lastName, email, password: passwordHash,
            avatarUrl: req.file?.filename === undefined ? '/src/public/images/avatar-img.png' : avatarPath
        })

        console.log("user send: ", user)

        await user.save();

        user.password = "";

        const token = getJWT(user._id.toString());

        res.cookie('token', token, cookieOptions);

        res.status(200).json({
            success: true,
            message: "user registered successfully",
            user
        })

    }catch(err){
        return next(new AppError("Error in registration, please try again later.", 500));
    }
}

export const login = async (req: Request, res: Response, next: NextFunction)=> {
    try{
        const { email, password } = req.body;

        if(!email || !password){
            return next(new AppError("Please enter the required fields", 400));
        }

        const user = await User.findOne({ email: email }).select('+password');
        if(!user){
            return next(new AppError("User doesn't exists, please register", 400));
        }

        if(!validatePassword(password, user.password)){
            return next(new AppError("Invalid input creadentials", 400));
        }

        const token  = getJWT(user._id.toString());

        res.cookie("token", token, cookieOptions);

        res.status(200).json({
            success: true,
            message: "user loggedin successfully",
            id: user._id,
            email: user.email
        })

    }catch(err){
        return new AppError("Error in login, please try again later.", 500);
    }
}

export const logout = async (req: Request, res: Response, next: NextFunction)=> {
    try{
        res.clearCookie("token", { 
            maxAge: 0,
            secure: true,
            httpOnly: true
         })

        res.status(200).json({
            success: true,
            message: "user loggedout successfully",
        })
    }catch(err){
        return new AppError("Error in logout, please try again later.", 500);
    }
}



