import { User } from "../models/user.model.js";
import  bcrypt  from "bcryptjs"
import  jwt from "jsonwebtoken"
import mongoose from "mongoose";
//register
export const register = async(req , res)=>{
const  {username, email, city, country, password } = req.body;
const pictUrl = req.file?.path || null 

try {
  const existUser = await User.findOne({email})
  if(existUser)return res.status(401).json({success:false, message:"A User with the  existing  email  exist."})
  if(!username ||!email ||! city ||!country ||! password){
    return res.status(401).json({success:false, message:"All fields are required."})
  }
  const hashedPassword = bcrypt.hashSync(password,  10);
  const  newUser = new User({
    username, 
    email,
    picture:pictUrl,
    city,
    country,
    password: hashedPassword,
  })
  await newUser.save()
  res.status(200).json({success:true, message:"Registered  successfully",newUser})

} catch (error) {
  res.status(500).json({success:false, message:"Internal error."})
}
}

export const loginSuccess = async(req, res) => {
const {email, password} = req.body;
try {
  const user = await User.findOne({email})
  if(!user)return res.status(404).json({success:false, message:"No User found"})
  const isMatchPassword = bcrypt.compareSync(password , user.password)
if(!isMatchPassword)return res.status(403).json({success:false, message:"Invalid  Password"})

  const  token = jwt.sign({id:user._id,
    username:user.username, 
    email:user.email,
    picture:user.picture,
    country:user.country, 
    city:user.city ,role:user.role}, process.env.SECRET_TOKEN, {expiresIn:"3h"})
  
    res.status(200).json({success:true, message:"Logged In ",user:{
      "id":user._id,
      "username":user.username,
      "email":user.email,
      "picture":user.picture,
      "country":user.country,
      "city":user.city,
      "role":user.role
    }, token:token})
} catch (error) {
  
}
};



export const currentUser = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ success: false, message: "Invalid user data" });
    }

    // Check if the user ID is valid
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    // Log the decoded user to verify it's correct
    console.log("Decoded user from token:", req.user);
    res.status(200).json({ success: true, user: req.user });
    
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const logout = (req, res) => {

};
