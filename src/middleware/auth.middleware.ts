import jwt, { type JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import type { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';

export const getJWT = (userId: string)=> {
    try{
        const jwtSecret = process.env.JWT_SECRET as string;
        if(!jwtSecret){
            console.log("jwt secret error");
        }

        const token = jwt.sign({ userId }, jwtSecret, {
            expiresIn: '3d'
        });

        return token;
    }catch(err){
        console.log("error in jwt token getting");
    }
}


export const validatePassword = async (inputPassword: string, passwordHash: string)=> {
    try{
        const isValidPassword = await bcrypt.compare(inputPassword, passwordHash);

        return isValidPassword;
    }catch(err){
        console.log("error in user input password validation");
    }
}


export const isLoggedInUser = async (req: Request, res: Response, next: NextFunction)=> {
    try{
        const token: string = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: 'Authentication token not found' });
        }

        const jwtSecret = process.env.JWT_SECRET as string;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not defined");
        }

        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

        const userId = decoded.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;

        next();

    }catch(err){
        console.log("error in checking user loggedin or not");
    }
}
