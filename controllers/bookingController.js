import Booking from "../models/Booking.js";
export const bookSlot = async (req, res) => {
  const booking = await Booking.create({
    ...req.body,
    userId: req.user.userId,
  });
  res.status(201).json(booking);
};
export const getBookings = async (req, res) => {
  const bookings = await Booking.find({ userId: req.user.userId })
    .skip((req.query.page - 1) * req.query.limit)
    .limit(parseInt(req.query.limit));
  res.json(bookings);
};
