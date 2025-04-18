import express  from "express"
import { createPartner } from "../controllers/partnerController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
const router =  express.Router()

router.post("/create-partner",authenticateToken, createPartner )



export default router;