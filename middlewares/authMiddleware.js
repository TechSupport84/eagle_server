import jwt from "jsonwebtoken";
import { Confirmation } from "../models/confirmation.model.js";

// Middleware: Verify JWT Token from Cookie
export const authenticateToken = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid token.", error: err.message });
    }

    req.user = decoded;
    next();
  });
};

// Middleware: Check if User is Admin
export const isAdmin = (req, res, next) => {
  if (req.user?.role === "admin") {
    return next();
  }

  return res.status(403).json({ success: false, message: "Access denied. Admins only." });
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
