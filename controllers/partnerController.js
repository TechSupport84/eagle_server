import { Partner } from "../models/partner.model.js";
import createError from "http-errors"


function generatePartnerID() {
    const letters = String.fromCharCode(
      65 + Math.floor(Math.random() * 26),
      65 + Math.floor(Math.random() * 26)
    ); 
  
    const digits = Math.floor(1000 + Math.random() * 9000); 
  
    return `${letters}${digits}`;
  }
  
export const createPartner = async(req, res ,next)=>{
    const { carName, plaqueNumber, tel, city,amount} = req.body;
    const userId = req.user?.id
    const userEmail = req.user?.email;
try {
    
    const existPartner=  await Partner.findOne({userId})

    if(existPartner)return res.status(403).json({success:false, message:"Cet partenaire  exist deja  dans le  system  avec le  meme Number  de  Plaque."})
    
    if(!carName ||!plaqueNumber ||!tel ||!city ||! amount)
    {
        return next(createError(401, "All fields are  required."))
    }
    if (!/^\d{10}$/.test(tel)) {
        return next(createError(400, "Le numéro de téléphone doit contenir exactement 10 chiffres."));
      }
    const newPartner = new Partner({
        userId,
        partnerID:generatePartnerID(), 
        carName,
        plaqueNumber,
        tel,
        city,
        amount
    })
    await newPartner.save()
    res.status(200).json({success:true, message:"Vous ete partenaire", data:newPartner})

} catch (error) {
    next(createError(500, "Internal error"))
}
}


export  const  getAllPartners = async(req , res , next)=>{
    try {
        const  partners = await Partner.find({}).populate('userId', "username")
        if(!partners)return next(createError(404,"NO Partner found!"))
        res.status(200).json({success:true, partnaire:partners})
    
    } catch (error) {
        next(createError(500, "Internal error"))
    }
}