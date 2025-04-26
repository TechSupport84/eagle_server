import mongoose from "mongoose"

const partnerSchema =  new  mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    partnerID:{type:String, required:true, unique:true},
    carName:{type:String, required:true},
    plaqueNumber:{type:String, required:true,unique:true},
    tel:{type:Number, required:true},
    city:{type:String, required:true},
    amount:{type:Number, required:true},


}, {timestamps:true})

export const Partner = mongoose.model("Partner", partnerSchema)