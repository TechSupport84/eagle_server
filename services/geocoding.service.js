import axios from "axios"

export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      params: {
        lat: latitude,
        lon: longitude,
        format: "json",
      },
      headers: {
        "User-Agent": "vtceaglestrans.com" // Replace with your app name
      }
    });

    return response.data.display_name;
  } catch (error) {
    console.error("Error in geocoding service:", error);
    throw new Error("Failed to reverse geocode");
  }
};

