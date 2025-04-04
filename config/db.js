import mongoose from "mongoose";

export const connectDb = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Connected successfully! ")
    } catch (error) {
        console.log("failed to  connect !")
    }
}