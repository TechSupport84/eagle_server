import axios from 'axios';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBUVXcCNitPtzs8G5aER9LQ3Phk_AdHFjc'; // Replace with your API key

// Function to get distance and duration from Google Maps API
async function getDistanceAndDuration(pickupLocation, dropLocation) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${pickupLocation}&destination=${dropLocation}&key=${GOOGLE_MAPS_API_KEY}`
    );

    const route = response.data.routes[0];
    const leg = route.legs[0];

    // Extract distance and duration from the response
    const distanceInMeters = leg.distance.value; // in meters
    const durationInSeconds = leg.duration.value; // in seconds

    // Convert distance to kilometers
    const distanceInKilometers = distanceInMeters / 1000; // Convert meters to kilometers

    // Convert duration to minutes
    const durationInMinutes = Math.ceil(durationInSeconds / 60); // Convert seconds to minutes

    return { distanceInKilometers, durationInMinutes };
  } catch (error) {
    console.error('Error fetching data from Google Maps API:', error);
    throw new Error('Unable to calculate distance and duration');
  }
}
export{getDistanceAndDuration}