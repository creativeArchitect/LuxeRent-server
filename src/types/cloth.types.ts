import type { ObjectId } from "mongoose"

export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export interface ClothTypes{
    name: string
    description: string
    brand: string
    category: string 
    size: Size
    pricePerDay: number
    // images: [string]
    image: string
    available: Boolean
    currentRental?: ObjectId
}

export type RentClothType = {
    clothId: ObjectId
    // name: string
    // brand: string
    // category: string
    // size: Size
    // pricePerDay: number
    totalPrice: number
    fromDate: Date
    toDate: Date
    // available: Boolean
    // currRental: string
  }


export interface ClothDocument extends ClothTypes, Document{}