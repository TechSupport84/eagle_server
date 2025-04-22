
import mongoose from "mongoose";

const  userSchema = new mongoose.Schema({
    username: {type:String , required:true},
    email:{type: String,required:true},
    picture:{type: String, required:false},
    city:{type:String, required:true},
    country:{type:String, required:true},
    password:{type:String, required:true},
    role:{type:String, enum:['client', 'admin'],default:'client'}
},{timestamps:true})

export const User = mongoose.model("User", userSchema)