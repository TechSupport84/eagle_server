import mongoose from "mongoose"

const partnerSchema =  new  mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    carName:{type:String, required:true},
    plaqueNumber:{type:Number, required:true,unique:true},
    tel:{type:Number, required:true},
    city:{type:String, required:true}

})

export const Partner = mongoose.model("Partner", partnerSchema)