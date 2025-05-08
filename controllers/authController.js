import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      picture: user.picture,
      country: user.country,
      city: user.city,
      role: user.role,
    },
    process.env.SECRET_TOKEN,
    { expiresIn: "3h" }
  );
};

// Helper function to set the authentication cookie
const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 24 * 60 * 60 * 1000,
  });
};

// Register
export const register = async (req, res) => {
  const { username, email, city, country, password } = req.body;
  const pictUrl = req.file?.path || null;

  try {
    if (!username || !email || !city || !country || !password) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(409).json({ success: false, message: "A user with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      picture: pictUrl,
      city,
      country,
      password: hashedPassword,
    });

    await newUser.save();

    const token = generateToken(newUser);
    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      message: "Registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        picture: newUser.picture,
        city: newUser.city,
        country: newUser.country,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Login
export const loginSuccess = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(403).json({ success: false, message: "Invalid email or password." });

    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) return res.status(403).json({ success: false, message: "Invalid email or password." });

    const token = generateToken(user);
    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        picture: user.picture,
        country: user.country,
        city: user.city,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Current User
export const currentUser = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ success: false, message: "Invalid user data." });
    }

    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ success: false, message: "Invalid user ID." });
    }

    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Logout
export const logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
