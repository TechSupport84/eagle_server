import express  from "express"
import { createPartner , getAllPartners, getCurrentPartner} from "../controllers/partnerController.js";
import { authenticateToken ,isAdmin} from "../middlewares/authMiddleware.js";
import { confirmation ,getAllConfirmedPartner, getAllUnconfirmedPartners} from "../controllers/confirmationController.js";

const router =  express.Router()

router.post("/create-partner",authenticateToken, createPartner )
router.get("/current-partner",authenticateToken, getCurrentPartner)
router.get("/unconfirmed-partner",authenticateToken,isAdmin, getAllUnconfirmedPartners)

router.post("/confirm",authenticateToken,isAdmin, confirmation)
router.get("/confirmed", authenticateToken,isAdmin, getAllConfirmedPartner)


export default router;