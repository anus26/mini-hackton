import  express from "express";
import { createOrder,getbyId,getorder } from "../controllers/order.controllers.js";
const router=express.Router()

router.post("/order",createOrder)
router.get("/order", getorder)
router.get("/id/:id",getbyId)
export default router