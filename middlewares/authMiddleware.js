import jwt from "jsonwebtoken";
import { Confirmation } from "../models/confirmation.model.js";
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Token", error: err.message });
    }

    req.user = decoded;
    next();
  });
};


export  const isAdmin = (req , res , next )=>{
  if(req.user?.role === "admin"){
    return next ()
  }
  res.status(403).json({success:false, message:"access  dinied admin only."})
}


export const isPartnerActive = async (req, res, next) => {
  try {
    const { partnerId } = req.body;

    if (!partnerId) {
      return res.status(400).json({ success: false, message: "partnerId is required." });
    }

    const now = new Date();

    const confirmation = await Confirmation.findOne({
      partnerId,
      startDate: { $lte: now },
      endDate: { $gte: now }
    });

    if (!confirmation) {
      return res.status(403).json({ success: false, message: "Partner is not active or subscription has expired." });
    }

    next();
  } catch (error) {
    console.error("Error checking partner status:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};
