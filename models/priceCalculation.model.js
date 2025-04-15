// models/PriceCalculation.js
import mongoose from "mongoose";

const PriceCalculationSchema = new mongoose.Schema({
  pickupLocation: { type: String, required: true },
  destination: { type: String, required: true },
  distance: { type: Number, required: true }, // in kilometers
  price: { type: Number, required: true },     // e.g., 10 * distance
  createdAt: { type: Date, default: Date.now },
});

export const PriceCalculation =  mongoose.model("PriceCalculation", PriceCalculationSchema);
