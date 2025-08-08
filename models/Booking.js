import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  purpose: { type: String, required: true },
  slotDate: { type: String, required: true },
  slotTime: { type: String, required: true },
  coupn_Code: { type: String },
  amount: { type: Number, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

{
  timestamps: true;
}

export default mongoose.model("Booking", bookingSchema);

