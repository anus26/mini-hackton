import  express from "express";
import { placeNewOrder } from "../controllers/order.controllers.js";
const router=express.Router()

router.post("/order",placeNewOrder)

export default router