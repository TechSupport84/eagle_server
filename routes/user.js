import express from "express";
import passport from "passport";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { loginSuccess } from "../controllers/authController.js";

const router = express.Router();

// Google Auth Route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

 
router.get("/me", authenticateToken, (req, res) => {
  res.status(200).json({
    message: "Authenticated user",
    user: req.user,
  });
  console.log("Currnect user", req.user)
});

// Google Auth Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const { token, accessToken, refreshToken } = req.user;

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    // Set cookies properly
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "None",
      secure: process.env.NODE_ENV === "production", // Set to true for production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie("accessToken", accessToken || "", {
      httpOnly: true,
      sameSite: "None",
      secure: process.env.NODE_ENV === "production", // Set to true for production
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
    });

    res.cookie("refreshToken", refreshToken || "", {
      httpOnly: true,
      sameSite: "None",
      secure: process.env.NODE_ENV === "production", // Set to true for production
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    console.log("Tokens Stored:", { token, accessToken, refreshToken });

    // Send only one response, redirect after storing cookies
    return res.redirect(`${process.env.CLIENT_URL}/home?token=${token}`);
  }
);

// Login Success Route
router.get("/login/success", authenticateToken, loginSuccess, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
 
  res.status(200).json({
    user: req.user,
    token: req.user.token,
  });
});

// Logout Route
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  req.logout(() => {
    res.redirect(`${process.env.CLIENT_URL}/`);
  });
});

export default router;
