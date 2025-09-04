import type { Request, Response, NextFunction } from "express";
import AppError from "../utils/error.utils";
import Clothes from "../models/clothes.model";

export const getAllClothes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clothes = await Clothes.find({});
    if (clothes.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No clothes exits.",
        clothes,
      });
    }

    res.status(200).json({
      success: true,
      message: "all clothes fetched successfully",
      clothes,
    });
  } catch (err) {
    console.log("Error in getAllClothes");
    return next(new AppError("ERROR: " + err, 500));
  }
};

export const getCloth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clothId = req.params.id;
    const cloth = await Clothes.findById(clothId);

    if (!cloth) {
      return next(new AppError("Cloth does not exist", 404));
    }

    res.status(200).json({
      success: true,
      message: "all clothes fetched successfully",
      cloth,
    });
  } catch (err) {
    console.log("Error in getCloth");
    return next(new AppError("ERROR: " + err, 500));
  }
};

export const addCloth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new AppError("user not exits, please login", 500));
    }

    if (user.role !== "admin") {
      return next(new AppError("restricted user previlages.", 401));
    }

    const {
      name,
      description,
      category,
      brand,
      size,
      pricePerDay,
      available,
    } = req.body;

    // if (!req.files || !(req.files instanceof Array)) {
    //   return next(new AppError("No images uploaded", 400));
    // }

    // const allImgPaths = (req.files as Express.Multer.File[]).map(f=> `/upload/clothes-data/${f.filename}`)


    //  beta version having only one cloth image
    if(req.file?.filename === undefined){
      return next(new AppError("No images uploaded", 400));
    }

    const imgPath = `/upload/clothes-data/${req.file?.filename}`

    if (
      !name ||
      !description ||
      !category ||
      !size || !brand ||
      !pricePerDay ||
      // allImgPaths.length === 0 ||
      !imgPath ||
      available === undefined
    ) {
      return next(new AppError("please fill the required fields", 400));
    }

    const cloth = await Clothes.create({
      name,
      description,
      category,
      brand,
      size,
      pricePerDay,
      // images: allImgPaths,
      image: imgPath,
      available,
    });

    res.status(200).json({
      success: true,
      message: "cloth added successfully",
      cloth,
    });
  } catch (err) {
    console.log("Error in addCloth");
    return next(new AppError("Something went wrong while adding cloth", 500));
  }
};

export const updateCloth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      return next(new AppError("user not exits, please login", 500));
    }

    if (user.role !== 'admin') {
      return next(new AppError("restricted user previlages.", 401));
    }

    const clothId = req.params.id;
    if (!clothId) {
      throw new Error("cloth id is required");
    }

    const clothData = await Clothes.findById(clothId);
    if (!clothData) {
      return next(new AppError("Cloth not found", 404));
    }

    const {
      name,
      description,
      category,
      brand,
      size,
      pricePerDay,
      available,
    } = req.body;

    // if (!req.files || !(req.files instanceof Array)) {
    //   return next(new AppError("No images uploaded", 400));
    // }

    // const allUpdateImgPaths = (req.files as Express.Multer.File[]).map(f=> `/upload/clothes-data/${f.filename}`)

    //  beta version having only one cloth image

    const imgPath = req.file?.filename !== undefined ? `/upload/clothes-data/${req.file?.filename}` : clothData.image

    const updatedClothData = {
      name: name ?? clothData?.name,
      description: description ?? clothData?.description,
      category: category ?? clothData?.category,
      size: size ?? clothData?.size,
      brand: brand ?? clothData?.brand,
      pricePerDay: pricePerDay ?? clothData?.pricePerDay,
      // images: clothData?.images,
      image: imgPath,
      available: available ?? clothData?.available,
    };

    const cloth = await Clothes.findByIdAndUpdate(clothId, updatedClothData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "cloth data updated successfully",
      cloth,
    });
  } catch (err) {
    console.log("Error in updateCloth");
    return next(new AppError("ERROR: " + err, 500));
  }
};

export const deleteCloth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new AppError("user not exits, please login", 500));
    }

    if (user.role !== "admin") {
      return next(new AppError("restricted user previlages.", 401));
    }

    const clothId = req.params.id;
    if (!clothId) {
      throw new Error("cloth id is required");
    }

    const cloth = await Clothes.findByIdAndDelete(clothId);

    res.status(200).json({
      success: true,
      message: "cloth data deleted successfully",
      cloth,
    });
  } catch (err) {
    console.log("Error in deleteCloth");
    return next(new AppError("ERROR: " + err, 500));
  }
};
