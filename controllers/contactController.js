import { Contact } from "../models/contact.model.js";
import createError from "http-errors";



export const createContact = async(req, res , next)=>{
const {name, email,message} = req.body;
try {
    if(!name ||!email ||!message){
        return  next(createError(400, "All fields are required."));
    }
    const newFeedback = new Contact({
        name,
        email,
        message
    })
    await newFeedback.save()
    res.status(200).json({success:true, message:"Contact created.", newFeedback})
} catch (error) {
    createError(next(500, "Internal  Error"))
}
}

export const getContacts = async(req , res , next)=>{
try {
    const feedBacks = await Contact.find({})
    if(!feedBacks) return next(createError(400, "No  feedBack found."))
    res.status(200).json({ success: true, message: "Feedback", feedback: feedBacks });

} catch (error) {
    next(createError(500, "Internal  Error"))
}
}

export const deleteAllFeedbacks = async (req, res, next) => {
    try {
      const result = await Contact.deleteMany({}); // Deletes ALL documents
  
      if (result.deletedCount === 0) {
        return next(createError(400, "No feedbacks found to delete."));
      }
  
      res.status(200).json({ success: true, message: "All feedbacks deleted successfully." });
    } catch (error) {
      next(createError(500, "Internal Error"));
    }
  };
  