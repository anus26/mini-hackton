import  express from "express";
import {getallregister, logoutUser, longinUser, refreshToken, registerUser, sendTestemail, uploadimage} from '../controllers/user.controllers.js'
import { upload } from "../middlware/multer.middleware.js";
const router=express.Router()
router.post("/register",registerUser);
router.post("/longin", longinUser);
router.post("/logout", logoutUser);
router.post("/refresh", refreshToken);
router.get("/sendemail",sendTestemail);
router.get("/register",getallregister)
router.post("/image",upload.single("image"),uploadimage)
export default router