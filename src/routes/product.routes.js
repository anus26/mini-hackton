import  express from "express";
import { getProduct, getProductByID, newProducts } from "../controllers/product.controllers.js";
import { upload } from "../middlware/multer.middleware.js";
const router=express.Router()

router.post("/products",upload.single("image"),newProducts)
router.get("/products",getProduct)
router.get("/getproduct/:id",getProductByID)
export default router