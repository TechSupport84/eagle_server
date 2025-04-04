import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    pickupLocation: { type: String, required: true },
    destination: { type: String, required: true },
    price: { type: Number, required: true },
    date: { type: Date, required: true },  
    time: { type: String, required: true },
    vehicleMark: { 
      type: String, 
      required: true, 
      enum: ["Suzukialto", "SuzukiAltoNew", "SuzukiEspresso", "SuzukiDzire", "SuzukiSwift", "Toyota"] 
    },
    tel: { type: String, required: true },
  },
  { timestamps: true }  
);

export const Order = mongoose.model("Order", orderSchema);
