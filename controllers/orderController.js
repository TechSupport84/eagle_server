import { Order } from "../models/order.model.js";
import validateOrderItems from "../utils/validate_order.js";
import createError from "http-errors";
import { sendOrderEmail } from "../utils/send_mail.js";

// Controller to create a new order
export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(createError(401, "User is not authenticated"));  // Change to 401 instead of 404
    }

    // Validate order data
    const orders = await validateOrderItems.validateAsync(req.body);
    if (!orders) {
      return next(createError(400, "All fields are required"));  // 400 for validation errors
    }

    // Create new order
    const newOrder = new Order({
      userId,
      pickupLocation: orders.pickupLocation,
      destination: orders.destination,
      price: orders.price,
      date: orders.date,
      time: orders.time,
      vehicleMark: orders.vehicleMark,
      tel: orders.tel
    });

    await newOrder.save();

    // Send email to admin
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
    console.error("Error creating order:", error);
    next(error);  // Pass the error to the error handling middleware
  }
};

// Controller to get orders by userId
export const getOrdersByUserId = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User is not authenticated" });
    }

    // Optional: Implement pagination to limit number of results
    const orders = await Order.find({ userId }).populate('userId', 'username email').lean();
    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// Controller to get a single order by its ID
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

// Controller to update an order
export const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const updates = req.body;

    // Validate updates before proceeding to avoid unauthorized changes
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

// Controller to delete an order
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
