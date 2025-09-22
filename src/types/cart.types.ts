import { ObjectId } from "mongoose";


export interface CartTypes {
    clothId: ObjectId
    userId: ObjectId
    startDate: Date
    endDate: Date
    totalDays?: Number
    totalPrice?: Number
}



