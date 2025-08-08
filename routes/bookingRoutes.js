import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import Booking from "../models/Booking.js";

const router = express.Router();

router.post("/book-slot", authMiddleware, async (req, res) => {
  try {
    const { name, mobile, purpose, slotDate, slotTime, coupon_Code, amount } =
      req.body;
    const userId = req.user.id;
    const existing = await Booking.findOne({ slotDate, slotTime, userId });
    if (existing) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    const booking = new Booking({
      name,
      mobile,
      purpose,
      slotDate,
      slotTime,
      coupon_Code,
      amount,
      user: req.user._id,
    });

    await booking.save();

    res.status(201).json({ message: "Slot booked successfully", booking });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server Error" });
  }
});

router.get("/all-bookings", authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { date, purpose, name } = req.query;

    let filter = {};
    if (date) filter.slotDate = date;
    if (purpose) filter.purpose = new RegExp(purpose, "i");
    if (name) filter.name = new RegExp(name, "i");

    const bookings = await Booking.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ slotDate: -1, slotTime: 1 });

    const total = await Booking.countDocuments(filter);

    res.status(200).json({ total, page, limit, bookings });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server Error" });
  }
});
router.get("/my-bookings", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ userId }).sort({
      slotDate: -1,
      slotTime: 1,
    });

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server Error" });
  }
});

export default router;

