import { reverseGeocode } from "../services/geocoding.service.js";
import { Location } from "../models/location.model.js";

export const getLocationFromCoordinates = async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Missing latitude or longitude" });
  }

  try {
    const address = await reverseGeocode(Number(latitude), Number(longitude));

    const newLocation = new Location({
      latitude,
      longitude,
      address,
    });

    await newLocation.save();

    res.status(200).json({ address });
  } catch (error) {
    console.error("Error in controller:", error);
    res.status(500).json({ error: "Failed to reverse geocode" });
  }
};


