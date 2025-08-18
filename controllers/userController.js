import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import BlacklistedToken from "../models/BlacklistedToken.js";
import { body, validationResult } from "express-validator";

// ================= HELPER: Validation Middleware =================
const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

// ================= EMAIL OTP SENDER =================
const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `Taxutsav <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP for Taxutsav",
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

// ================= SIGNUP =================
export const signup = [
  body("user_name").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("mobile_number").notEmpty().withMessage("Mobile number is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("reEnterPassword")
    .notEmpty()
    .withMessage("Please re-enter your password"),

  async (req, res) => {
    if (handleValidation(req, res)) return;

    const { user_name, email, mobile_number, password, reEnterPassword } =
      req.body;

    if (password !== reEnterPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new User({
      user_name,
      email,
      mobile_number,
      password: hashedPassword,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
      verified: false,
    });

    await newUser.save();
    await sendOTP(email, otp);

    res.status(201).json({ message: "OTP sent to email" });
  },
];

// ================= VERIFY OTP =================
export const verifyOtp = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("otp").notEmpty().withMessage("OTP is required"),

  async (req, res) => {
    if (handleValidation(req, res)) return;

    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.verified) return res.json({ message: "Already verified" });
    if (user.otp !== otp || Date.now() > user.otpExpiry)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.verified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: "Email verified successfully" });
  },
];

// ================= LOGIN =================
export const login = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  body("deviceType")
    .notEmpty()
    .withMessage("deviceType is required")
    .isIn(["1", "2"])
    .withMessage("deviceType must be '1' (Web) or '2' (Mobile)"),

  async (req, res) => {
    if (handleValidation(req, res)) return;

    const { email, password, deviceType } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.verified)
      return res.status(400).json({ message: "Email not verified" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token, deviceType });
  },
];

// ================= FORGOT PASSWORD =================
export const forgotPassword = [
  body("email").isEmail().withMessage("Valid email is required"),

  async (req, res) => {
    if (handleValidation(req, res)) return;

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendOTP(email, otp);
    res.json({ message: "OTP sent to your email" });
  },
];

// ================= RESET PASSWORD =================
export const resetPassword = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("otp").notEmpty().withMessage("OTP is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  async (req, res) => {
    if (handleValidation(req, res)) return;

    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.otp !== otp || Date.now() > user.otpExpiry)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  },
];

// ================= LOGOUT =================
export const logout = async (req, res) => {
  const token = req.token;
  await BlacklistedToken.create({
    token,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
  res.json({ message: "Logged out successfully" });
};
