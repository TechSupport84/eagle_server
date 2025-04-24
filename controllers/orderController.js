import { Order } from "../models/order.model.js";
import { Partner } from "../models/partner.model.js";
import { Confirmation } from "../models/confirmation.model.js";
import validateOrderItems from "../utils/validate_order.js";
import createError from "http-errors";
import { sendOrderEmail } from "../utils/send_mail.js";

// Function to calculate price per minute
function calculatePrice(duration) {
  const baseRate = 1500; // Minimum base rate
  const randomPerMinute = Math.floor(Math.random() * 51) + 50; // Random between 50 - 100
  return baseRate + (randomPerMinute * duration);
}

export const createOrder = async (req, res, next) => {
  try {
    const { pickupLocation, dropLocation, duration } = req.body;
    const clientId = req.user.id;

    // Check for required fields
    if (!pickupLocation || !dropLocation || !duration) {
      return res.status(400).json({ success: false, message: "pickupLocation, dropLocation, and duration are required." });
    }

    const now = new Date();

    // Find all active confirmations
    const activeConfirmations = await Confirmation.find({ 
      startDate: { $lte: now }, 
      endDate: { $gte: now }
    });

    if (activeConfirmations.length === 0) {
      return res.status(404).json({ success: false, message: "No active partners available." });
    }

    // Extract partnerIds from active confirmations
    const activePartnerIds = activeConfirmations.map(c => c.partnerId);

    // Fetch only partners who are active
    const partners = await Partner.find({ partnerID: { $in: activePartnerIds } });

    if (partners.length === 0) {
      return res.status(404).json({ success: false, message: "No valid partners found." });
    }

    // Select a random partner
    const randomPartner = partners[Math.floor(Math.random() * partners.length)];

    // Calculate random price
    const price = calculatePrice(duration);

    // Create a new order
    const order = new Order({
      userId: clientId,
      pickupLocation,
      dropLocation,
      duration,
      price,
      partner: {
        _id: randomPartner._id,
        partnerID: randomPartner.partnerID,
        carName: randomPartner.carName,
        plaqueNumber: randomPartner.plaqueNumber,
        tel: randomPartner.tel,
        city: randomPartner.city,
        amount: randomPartner.amount
      }
    });

    // Save the order
    await order.save();

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("Error creating order:", error);
    next(error);
  }
};


   
export const getCurrentOrderByUserId = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const currentOrder = await Order.findOne({ userId })
      .sort({ createdAt: -1 }) // get the latest order
      .populate({
        path: 'userId',
        select: 'email username'
      });

    if (!currentOrder) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json(currentOrder);
  } catch (error) {
    console.error("Error fetching current order:", error);
    res.status(500).json({ message: "Error fetching current order" });
  }
};
//delete the currect orders
export const deleteCurrentOrder = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Get the latest order of the user
    const currentOrder = await Order.findOne({ userId }).sort({ createdAt: -1 });

    if (!currentOrder) {
      return res.status(404).json({ message: "No current order found for this user" });
    }

    await Order.findByIdAndDelete(currentOrder._id);

    res.status(200).json({ message: "Current order deleted successfully" });
  } catch (error) {
    console.error("Error deleting current order:", error);
    res.status(500).json({ message: "Error deleting current order" });
  }
};


//------------------------------------
export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Error fetching order" });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const updates = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updates, { new: true }).lean();
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Error updating order" });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Error deleting order" });
  }
};