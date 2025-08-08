import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import {
  uploadDocument,
  getDocuments,
} from "../controllers/documentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Secure routes with authMiddleware
router.post("/upload", authMiddleware, upload.single("file"), uploadDocument);
router.get("/", authMiddleware, getDocuments);

export default router;
