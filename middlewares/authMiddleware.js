import jwt from "jsonwebtoken";
import BlacklistedToken from "../models/BlacklistedToken.js";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization header missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  // Check if token is blacklisted
  const blacklisted = await BlacklistedToken.findOne({ token });
  if (blacklisted) {
    return res
      .status(401)
      .json({ message: "Token has been invalidated. Please log in again." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("user_name email");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ Set both for flexibility
    req.user = {
      userId: user._id,
      user_name: user.user_name,
      email: user.email,
    };
    req.userId = user._id;
    req.token = token;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
