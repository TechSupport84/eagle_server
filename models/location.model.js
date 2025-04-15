
import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  address: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Location = mongoose.model("Location", LocationSchema);
