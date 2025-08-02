import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  user_name: String,
  email: { type: String, unique: true },
  password: String,
  otp: String,
  otpExpires: Date,
  verified: { type: Boolean, default: false },
});

export default mongoose.model("User", userSchema);
