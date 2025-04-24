import express  from "express"
const router = express.Router()
import { createOrder, getCurrentOrderByUserId, deleteCurrentOrder} from "../controllers/orderController.js"
import { authenticateToken } from "../middlewares/authMiddleware.js"


router.post("/create", authenticateToken, createOrder)
router.get("/user/:id",authenticateToken,getCurrentOrderByUserId )
router.delete("/delete",authenticateToken,deleteCurrentOrder)






export default router;