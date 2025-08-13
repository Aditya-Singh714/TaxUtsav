import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { sendMessage, getChatList } from "../controllers/chatController.js";

const router = express.Router();

// Send a message
router.post("/send", authMiddleware, sendMessage);

// Get all messages
router.get("/list", authMiddleware, getChatList);

export default router;
