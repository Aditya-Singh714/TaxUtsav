import jwt from "jsonwebtoken";
import BlacklistedToken from "../models/BlacklistedToken.js";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "Authorization header missing" });

  const token = authHeader.split(" ")[1];

  const blacklisted = await BlacklistedToken.findOne({ token });
  if (blacklisted)
    return res.status(401).json({ message: "Token has been invalidated" });

  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    req.user = decoded;
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
