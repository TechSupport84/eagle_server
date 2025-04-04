import express  from "express"
const router = express.Router()
import { createOrder, getOrdersByUserId  } from "../controllers/orderController.js"
import { authenticateToken } from "../middlewares/authMiddleware.js"

router.get("/", authenticateToken, getOrdersByUserId)
router.post("/create", authenticateToken, createOrder)






export default router;