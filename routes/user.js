import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { loginSuccess , register , currentUser, logout} from "../controllers/authController.js";

const router = express.Router();

router.post("/register",register)
router.post("/login",loginSuccess)
router.post("/logout",logout)


router.get("/me", authenticateToken, currentUser)
   

export default router;
