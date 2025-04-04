import mongoose from "mongoose";

const  userSchema = new mongoose.Schema({
    username: {type:String , required:true},
    email:{type: String,required:true},
    picture:{type: String},
    googleId:{type:String}
},{timestamps:true})

export const User = mongoose.model("User", userSchema)