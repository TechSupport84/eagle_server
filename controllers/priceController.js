// routes/price.js
import express from "express";
import { PriceCalculation } from "../models/priceCalculation.model.js";

// Simulate getting distance (to be replaced with real API like Google Maps)
const mockGetDistance = async (pickup, destination) => {
  // Simulate longer distances for different destinations
  const hash = pickup.length + destination.length;
  const distance = (hash % 500) + 1; // distance between 1 and 15 km
  return distance;
};

export const pricePicker = async (req, res) => {
  const { pickup, destination } = req.query;

  if (!pickup || !destination) {
    return res.status(400).json({ message: "Pickup and destination are required." });
  }

  try {
    const distance = await mockGetDistance(pickup, destination);
    const ratePerKm = 300; // FCFA per kilometer
    let price = 500 + (distance * ratePerKm);

    // Optional: round to nearest 10 FCFA
    price = Math.ceil(price / 10) * 10;

    const newCalculation = new PriceCalculation({
      pickupLocation: pickup,
      destination,
      distance,
      price,
    });

    await newCalculation.save();

    res.status(200).json({ distance, price });
  } catch (error) {
    console.error("Price calculation error:", error);
    res.status(500).json({ message: "Failed to calculate distance and price." });
  }
};
