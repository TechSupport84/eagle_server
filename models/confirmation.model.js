import mongoose  from "mongoose";

const  confirmationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    partnerId:{type:String, required:true, unique:true},
    tokenMoney:{type:String, required:true,unique:true},
    amount:{type:Number, required:true},
    startDate:{ type: Date, default: Date.now },
    endDate:{type:Date}
},{timestamps:true})

export const Confirmation = mongoose.model("Confirmation",confirmationSchema)