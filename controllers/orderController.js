import { Order } from "../models/order.model.js";
import validateOrderItems from "../utils/validate_order.js";
import createError from "http-errors";
import { sendOrderEmail } from "../utils/send_mail.js";

export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(createError(404, "User is not authenticated"));
    }

    const orders = await validateOrderItems.validateAsync(req.body);
    if (!orders) {
      return next(createError(401, "All fields are required"));
    }

    const newOrder = new Order({
      userId,
      pickupLocation: orders.pickupLocation,
      destination: orders.destination,
      price: orders.price,
      date: orders.date,
      time: orders.time,
      vehicleMark: orders.vehicleMark,
      tel:orders.tel
    });

    await newOrder.save();

    const adminEmail = process.env.ADMIN_EMAIL;

    await sendOrderEmail(req.user.email, adminEmail, {
      clientName: req.user.username,
      clientEmail: req.user.email,
      orderId: newOrder._id,
      pickupLocation: orders.pickupLocation,
      destination: orders.destination,
      price: orders.price,
      date: orders.date,
      time: orders.time,
      vehicleMark: orders.vehicleMark,
      tel: orders.tel,
    });

    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    next(error);
  }
};

   
export const getOrdersByUserId = async (req, res) => {
  try {
    const userId = req.user?.id;
    console.log(userId);
    if (!userId) {
      return res.status(401).json({ message: "User is not authenticated" });
    }

    const orders = await Order.find({ userId }).populate("email").lean();
    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

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