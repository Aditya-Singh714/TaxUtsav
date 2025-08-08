import express from "express";
import {
  createOrder,
  getOrders,
  verifyPayment,
} from "../controllers/orderController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();
router.post("/create-order", authMiddleware, createOrder);
router.get("/", authMiddleware, getOrders);
router.post("/verify-payment", authMiddleware, verifyPayment);
export default router;
