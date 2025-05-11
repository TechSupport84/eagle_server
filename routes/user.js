import express from "express"
import { deletUser, getAllUser, getMe, login, logout, register, requestCode, resetPassword, updatePassword, updateProfile } from "../controllers/authController.js"
import { verifyToken , isAdmin} from "../middlewares/authMiddleware.js"
import { upload } from "../middlewares/UploadImage.js";

const  router = express.Router()


router.post("/register",register);
router.post("/login",login)
router.post("/logout",logout)
router.get("/me",verifyToken, getMe)

router.put("/update", verifyToken, upload.single("profileUrl"),updateProfile);
router.put("/update-password",verifyToken, updatePassword)

router.post("/request-code", requestCode)
router.post("/reset-password", resetPassword)
router.get("/",verifyToken,isAdmin, getAllUser)
router.delete("/:id",verifyToken, isAdmin, deletUser)














export{router as userRouter}