import { Order } from "../models/order.model.js";
import { Partner } from "../models/partner.model.js";
import { Confirmation } from "../models/confirmation.model.js";
import validateOrderItems from "../utils/validate_order.js";
import createError from "http-errors";
import { sendOrderEmail } from "../utils/send_mail.js";
import { getTravelDuration } from "../features/googMaps.js";

// Function to calculate price based on a fixed rate per minute
function calculatePrice(duration) {
  const ratePerMinute = 187; // Fixed rate per minute
  return ratePerMinute * duration;
}

// Create new order
export const createOrder = async (req, res, next) => {
  try {
    const { pickupLocation, dropLocation ,orderDate,orderHour} = req.body;
    const clientId = req.user?.id;

    if (!pickupLocation || !dropLocation||!orderDate||!orderHour) {
      return res
        .status(400)
        .json({ success: false, message: "pickupLocation and dropLocation are required." });
    }

    const now = new Date();
    const activeConfirmations = await Confirmation.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
    });

    if (!activeConfirmations.length) {
      return res.status(404).json({ success: false, message: "No active partners available." });
    }

    const partners = await Partner.find({
      partnerID: { $in: activeConfirmations.map((c) => c.partnerId) }
    });

    if (!partners.length) {
      return res.status(404).json({ success: false, message: "No valid partners found." });
    }

    const randomPartner = partners[Math.floor(Math.random() * partners.length)];
    const duration = await getTravelDuration(pickupLocation, dropLocation);

    if (!duration) {
      return res
        .status(500)
        .json({ success: false, message: "Could not calculate travel duration." });
    }

    const price = calculatePrice(duration);

    const order = new Order({
      userId: clientId,
      pickupLocation,
      dropLocation,
      duration,
      price,
      status: "pending", // initial status
      orderDate:new Date(orderDate),
      orderHour,
      partner: {
        _id: randomPartner._id,
        partnerID: randomPartner.partnerID,
        carName: randomPartner.carName,
        plaqueNumber: randomPartner.plaqueNumber,
        tel: randomPartner.tel,
        city: randomPartner.city,
        amount: randomPartner.amount,
      },
    });

    await order.save();
    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("Error creating order:", error);
    next(error);
  }
};

// Accept an order (update status to 'accepted')
export const acceptOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("acceptOrder called for orderId:", id);

    // Try to atomically find a pending order and flip it to 'accepted'
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: id, status: "pending" },
      { status: "accepted" },
      { new: true }
    );

    if (!updatedOrder) {
      // Either it didn't exist, or wasn't pending
      // Check existence first
      const exists = await Order.exists({ _id: id });
      if (!exists) {
        return res.status(404).json({ message: "Order not found" });
      } else {
        return res
          .status(400)
          .json({ message: "Only pending orders can be accepted." });
      }
    }

    return res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Error accepting order:", error);
    next(error);
  }
};

// Complete an order (update status to 'completed')
export const completeOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "accepted") {
      return res.status(400).json({ message: `Cannot complete order in status '${order.status}'` });
    }

    order.status = "completed";
    await order.save();
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error completing order:", error);
    next(error);
  }
};

// Get current order by user
export const getCurrentOrderByUserId = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const currentOrder = await Order.findOne({ userId })
      .sort({ createdAt: -1 })
      .populate({ path: "userId", select: "email username" });

    if (!currentOrder) return res.status(404).json({ message: "No orders found for this user" });

    res.status(200).json(currentOrder);
  } catch (error) {
    console.error("Error fetching current order:", error);
    res.status(500).json({ message: "Error fetching current order" });
  }
};

// Delete current order
export const deleteCurrentOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const currentOrder = await Order.findOne({ userId }).sort({ createdAt: -1 });
    if (!currentOrder) return res.status(404).json({ message: "No current order found for this user" });

    await Order.findByIdAndDelete(currentOrder._id);
    res.status(200).json({ message: "Current order deleted successfully" });
  } catch (error) {
    console.error("Error deleting current order:", error);
    res.status(500).json({ message: "Error deleting current order" });
  }
};

// Other existing order CRUD functions...
export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).lean();
    if (!order) return res.status(404).json({ message: "Order not found" });
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
    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
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
    if (!deletedOrder) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Error deleting order" });
  }
};
