import axios from "axios";
import dotenv  from "dotenv"
dotenv.config()


// Simple geocoding via Nominatim (OpenStreetMap)
async function geocodeAddress(address) {
  const res = await axios.get("https://nominatim.openstreetmap.org/search", {
    params: {
      q: address,
      format: "json",
      limit: 1
    }
  });

  if (!res.data.length) {
    throw new Error(`No geocoding result for "${address}"`);
  }

  const { lat, lon } = res.data[0];
  return {
    latitude: parseFloat(lat),
    longitude: parseFloat(lon)
  };
}

export const getTravelDuration = async (pickupLocation, dropLocation) => {
  try {
    // 1️⃣ If user passed a string, geocode it
    let pickupCoords = typeof pickupLocation === "string"
      ? await geocodeAddress(pickupLocation)
      : pickupLocation;

    let dropCoords = typeof dropLocation === "string"
      ? await geocodeAddress(dropLocation)
      : dropLocation;

    // 2️⃣ Validate we have coords
    if (
      !pickupCoords?.latitude || !pickupCoords?.longitude ||
      !dropCoords?.latitude  || !dropCoords?.longitude
    ) {
      throw new Error("Invalid pickup or drop coordinates");
    }

    // 3️⃣ Call OpenRouteService Matrix API
    const matrixRes = await axios.post(
      "https://api.openrouteservice.org/v2/matrix/driving-car",
      {
        locations: [
          [pickupCoords.longitude, pickupCoords.latitude],
          [dropCoords.longitude, dropCoords.latitude]
        ],
        metrics: ["duration"]
      },
      {
        headers: {
          Authorization: process.env.OPENROUTESERVICE_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    const seconds = matrixRes.data.durations?.[0]?.[1];
    if (typeof seconds !== "number") {
      throw new Error("No duration returned from Matrix API");
    }

    return Math.ceil(seconds / 60); // minutes
  } catch (err) {
    console.error("Error fetching travel duration:", err.response?.data || err.message);
    throw new Error("Error fetching distance from OpenRouteService API");
  }
};
