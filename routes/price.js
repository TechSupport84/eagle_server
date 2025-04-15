import express from "express"
import { pricePicker } from "../controllers/priceController.js"

const router = express.Router()

router.get("/calculate-distance",pricePicker)







export default router;