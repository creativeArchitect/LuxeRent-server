

class AppError extends Error{
    public statusCode: number

    constructor(message: string, statusCode: number){
        super(message);
        this.statusCode = statusCode;

        // Maintains proper stack trace
        Error.captureStackTrace(this, this.constructor);  
        
        this.name = this.constructor.name;  // error a meaningful name (e.g., AppError)
    }
}

export default AppError;