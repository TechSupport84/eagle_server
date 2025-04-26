import express from "express"
import { createContact  , getContacts, deleteAllFeedbacks} from "../controllers/contactController.js";

const router = express.Router();



router.post("/create-contact",createContact)
router.get("/contacts",getContacts)
router.delete("/delete",deleteAllFeedbacks )









export default router;