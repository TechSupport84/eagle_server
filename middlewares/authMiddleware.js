import jwt from "jsonwebtoken";
import { Confirmation } from "../models/confirmation.model.js";
import createError from "http-errors";


export const verifyToken = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];

  if (!token) {
    return next(createError(401, "Access denied. No token provided."));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return next(createError(403, "Invalid or expired token."));
  }
};

// Middleware to check if the user is an admin
export const isAdmin = async (req, res, next) => {
  try {
    // Ensure the user has the admin role
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next(); // Proceed if admin
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
// Middleware: Check if Partner is Active
export const isPartnerActive = async (req, res, next) => {
  try {
    const { partnerId } = req.body;

    if (!partnerId) {
      return res.status(400).json({
        success: false,
        message: "partnerId is required.",
      });
    }

    const now = new Date();

    const confirmation = await Confirmation.findOne({
      partnerId,
      startDate: { $lte: now },
      endDate: { $gte: now },
    });

    if (!confirmation) {
      return res.status(403).json({
        success: false,
        message: "Partner is not active or subscription has expired.",
      });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error checking partner status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
