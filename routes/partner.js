import express  from "express"
import { createPartner , getAllPartners} from "../controllers/partnerController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { confirmation ,getAllConfirmedPartner} from "../controllers/confirmationController.js";

const router =  express.Router()

router.post("/create-partner",authenticateToken, createPartner )
router.get("/partners",authenticateToken,  getAllPartners)

router.post("/confirm",authenticateToken, confirmation)
router.get("/confirmed", authenticateToken, getAllConfirmedPartner)


export default router;