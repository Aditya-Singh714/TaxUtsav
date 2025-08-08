import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  purpose: String,
  slotDate: String,
  slotTime: String,
  coupon_Code: String,
  amount: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
export default mongoose.model("Booking", bookingSchema);
