import { Partner } from "../models/partner.model.js";
import createError from "http-errors"

export const createPartner = async(req, res ,next)=>{
    const {carName, plaqueNumber, tel, city} = req.body;
    const userId = req.user?.id
    const userEmail = req.user?.email;
    

    if(!carName ||!plaqueNumber ||!tel ||!city)
    {
        return next(createError(401, "All fields are  required."))
    }
    const newPartner = new Partner({
        userId,
        carName,
        plaqueNumber,
        tel,
        city
    })
    await newPartner.save()
    res.status(200).json({success:true, message:"Vous ete partenaire"})

}