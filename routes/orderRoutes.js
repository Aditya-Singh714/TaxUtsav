import express from "express";
import {
  createOrder,
  getOrders,
  verifyPaymentRedirect,
} from "../controllers/orderController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create Razorpay order
router.post("/create-order", createOrder);

// Get all orders for logged-in user
router.get("/", authMiddleware, getOrders);

// Verify payment with redirect flow
router.post("/verify-payment-redirect", verifyPaymentRedirect);

export default router;

