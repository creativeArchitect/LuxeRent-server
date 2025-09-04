import type { ObjectId } from "mongoose"


export interface ClothTypes{
    name: string
    description: string
    brand: string
    category: string 
    size: "XS" | "S" | "M" | "L" | "XL" | "XXL"
    pricePerDay: number
    // images: [String]
    image: String
    available: Boolean
    currentRental?: ObjectId
}


export interface ClothDocument extends ClothTypes, Document{}