import Document from "../models/Document.js";

// POST /api/documents/upload
export const uploadDocument = async (req, res) => {
  try {
    const userId = req.user.userId; // ✅ from authMiddleware
    const { type } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const doc = await Document.create({
      userId,
      type,
      fileName: req.file.originalname,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
    });

    res.status(201).json({ message: "Document uploaded successfully", doc });
  } catch (error) {
    console.error("Upload Document Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/documents?page=1&limit=10
export const getDocuments = async (req, res) => {
  try {
    const userId = req.user.userId; // ✅ from authMiddleware
    const { page = 1, limit = 10 } = req.query;

    const documents = await Document.find({ userId })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Document.countDocuments({ userId });

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      documents,
    });
  } catch (error) {
    console.error("Get Documents Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
