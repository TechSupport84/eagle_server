import express  from "express"
import { createPartner , getAllPartners, getCurrentPartner} from "../controllers/partnerController.js";
import { verifyToken ,isAdmin} from "../middlewares/authMiddleware.js";
import { confirmation ,getAllConfirmedPartner, getAllUnconfirmedPartners} from "../controllers/confirmationController.js";

const router =  express.Router()

router.post("/create-partner",verifyToken, createPartner )
router.get("/current-partner",verifyToken, getCurrentPartner)
router.get("/unconfirmed-partner",verifyToken,isAdmin, getAllUnconfirmedPartners)

router.post("/confirm",verifyToken,isAdmin, confirmation)
router.get("/confirmed", verifyToken,isAdmin, getAllConfirmedPartner)


export default router;