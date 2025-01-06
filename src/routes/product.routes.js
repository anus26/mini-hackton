import  express from "express";
import { deleteproduct, getProduct, getProductByID, newProducts, updateproduct } from "../controllers/product.controllers.js";
import { upload } from "../middlware/multer.middleware.js";
const router=express.Router()

router.post("/products",upload.single("image"),newProducts)
router.get("/products",getProduct)
router.get("/getproduct/:id",getProductByID)
router.put("/updateproduct/:id",updateproduct)
router.delete("/deleteproduct/:id",deleteproduct)
export default router