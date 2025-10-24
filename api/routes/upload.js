import express from "express";
// import multer from "multer";
import upload from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// ✅ 1. Use multer to store temporary uploads
// const upload = multer({ dest: "tmp/" });

// ✅ 2. Upload endpoint
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

       const folder = req.body.folder || "products";


    // ✅ Upload to Cloudinary
     // ✅ Upload in-memory buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder },
        (err, uploaded) => {
          if (err) reject(err);
          else resolve(uploaded);
        }
      );
      stream.end(req.file.buffer); // send file buffer directly
    });

    // ✅ Respond with Cloudinary URL
    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({
      error: "Upload failed",
      details: err.message,
    });
  }
});

export default router;
