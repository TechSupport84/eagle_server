import express  from "express"
import {getLocationFromCoordinates} from "../controllers/locationController.js"

const router = express.Router()

router.get("/reverse-geocode",getLocationFromCoordinates)





export default router