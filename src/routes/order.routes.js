import  express from "express";
import { createOrder } from "../controllers/order.controllers.js";
const router=express.Router()

router.post("/order",createOrder)

export default router