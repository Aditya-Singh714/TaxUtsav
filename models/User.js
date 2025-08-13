import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  user_name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String },
  description: { type: String },
  amount: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  otp: String,
  otpExpires: Date,
  verified: { type: Boolean, default: false },
});

export default mongoose.model("User", userSchema);
