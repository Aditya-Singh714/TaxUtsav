import express from "express";
import {
  signup,
  login,
  verifyOtp,
  forgotPassword,
  resetPassword,
  logout,
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();
router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", authMiddleware, logout);
export default router;
