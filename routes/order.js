import express  from "express"
const router = express.Router()
import { createOrder, getCurrentOrderByUserId, deleteCurrentOrder, acceptOrder, completeOrder, } from "../controllers/orderController.js"
import { authenticateToken } from "../middlewares/authMiddleware.js"


router.post("/create", authenticateToken, createOrder)
router.get("/user/:id",authenticateToken,getCurrentOrderByUserId )
router.delete("/delete",authenticateToken,deleteCurrentOrder)
router.put("/:id/accept", authenticateToken, acceptOrder)
router.put("/:id/complete", authenticateToken, completeOrder)






export default router;