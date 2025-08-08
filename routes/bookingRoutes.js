import express from "express";
import { bookSlot, getBookings } from "../controllers/bookingController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();
router.post("/book-slot", authMiddleware, bookSlot);
router.get("/all-bookings", authMiddleware, getBookings);
export default router;
