import express  from "express"
const router = express.Router()
import { createOrder, getCurrentOrderByUserId, deleteCurrentOrder, acceptOrder, completeOrder, } from "../controllers/orderController.js"
import { verifyToken } from "../middlewares/authMiddleware.js"


router.post("/create", verifyToken, createOrder)
router.get("/user/:id",verifyToken,getCurrentOrderByUserId )
router.delete("/delete",verifyToken,deleteCurrentOrder)
router.put("/:id/accept", verifyToken, acceptOrder)
router.put("/:id/complete", verifyToken, completeOrder)






export default router;