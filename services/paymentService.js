import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const WAVE_API_KEY = process.env.WAVE_TOKEN;  // Ensure this matches your environment variable
const BASE_URL = 'https://api.wave.com/v1/';

console.log('Using API Key:', WAVE_API_KEY); // Debugging line to verify the key

// Function to create a recipient
export const createRecipient = async (first_name, last_name, phone_number) => {
  if (!WAVE_API_KEY) {
    throw new Error('Missing Wave API key (WAVE_TOKEN) in environment variables.');
  }

  try {
    const response = await axios.post(
      `${BASE_URL}recipients`, // Correct endpoint for creating a recipient
      {
        first_name,
        last_name,
        phone_number,
        network: 'orange',  // Adjust as needed for the recipient's network
      },
      {
        headers: {
          Authorization: `Bearer ${WAVE_API_KEY}`, // Bearer token for authentication
          'Content-Type': 'application/json',     // Ensure the content type is set to JSON
        },
      }
    );
    return response.data; // Return the recipient data
  } catch (error) {
    console.error('❌ Error creating recipient:', error.response?.data || error.message);
    throw new Error('Failed to create recipient: ' + (error.response?.data?.message || error.message));
  }
};

// Function to create a payment request
export const createPaymentRequest = async (amount, recipientId) => {
  const externalId = 'PAY_' + Date.now(); // Unique external ID for the payment request

  if (!WAVE_API_KEY) {
    throw new Error('Missing Wave API key (WAVE_TOKEN) in environment variables.');
  }

  try {
    const response = await axios.post(
      `${BASE_URL}payments`,  // Correct endpoint for creating a payment request
      {
        amount,                // Amount to be paid (in XOF or other currency)
        currency: 'XOF',       // Currency for the payment
        recipient: recipientId, // ID of the recipient created earlier
        external_id: externalId, // External ID for tracking
        metadata: {
          purpose: 'Payment for services',  // Additional metadata about the payment
        },
      },
      {
        headers: {
          Authorization: `Bearer ${WAVE_API_KEY}`, // Authorization header with the API key
          'Content-Type': 'application/json', // Content type for JSON payload
        },
      }
    );

    return response.data; // Return the payment request data
  } catch (error) {
    console.error('❌ Error creating payment request:', error.response?.data || error.message);
    throw new Error('Failed to create payment request: ' + (error.response?.data?.message || error.message));
  }
};
