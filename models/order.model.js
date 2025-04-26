
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
 userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  partner: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner' },
    partnerID: String,
    carName: String,
    plaqueNumber: String,
    tel: String,
    city: String,
    amount: Number,
  },
  pickupLocation: { type: String, required: true },
  dropLocation: { type: String, required: true },
  duration: { type: Number, required: true }, 
  price: { type: Number, required: true }, 
  status: { type: String, enum: ['pending', 'accepted', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
},{timestamps:true});

export const Order=  mongoose.model('Order', OrderSchema);
