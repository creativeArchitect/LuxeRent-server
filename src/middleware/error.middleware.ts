import type { Request, Response, NextFunction } from "express";


const errorMiddleware = async (err: any, req: Request, res: Response, next: NextFunction)=> {    
    err.status = err.status || 500;
    err.message = err.message || "something went wrong."

    res.status(err.status).json({
        success: false,
        message: err.message
    })
}


export default errorMiddleware;