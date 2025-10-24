import express from "express";
import multer from "multer";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// ✅ 1. Use multer to store temporary uploads
const upload = multer({ dest: "tmp/" });

// ✅ 2. Upload endpoint
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const path = req.file.path;
    const folder = req.body.folder || "products";

    // ✅ Upload to Cloudinary
    const result = await cloudinary.uploader.upload(path, { folder });

    // ✅ Clean up temporary file
    fs.unlinkSync(path);

    // ✅ Respond with Cloudinary URL
    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

export default router;
