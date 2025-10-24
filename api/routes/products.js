import express from "express";
import Product from "../models/Product.js";
import upload from "../middleware/upload.js"; // multer memory upload
import cloudinary from "../config/cloudinary.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Helper: safe JSON parse
const safeParse = (v) => {
  if (typeof v !== "string") return v;
  try { return JSON.parse(v); } catch { return v; }
};

// ✅ Create Product (Admin only)
router.post("/", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    const { title, age, isbn, features, price, category, level } = req.body;

    if (!title || !price) {
      return res.status(400).json({ message: "Title and price are required." });
    }

    let imageUrl = "";
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const lastProduct = await Product.findOne().sort({ id: -1 });
    const nextId = lastProduct ? lastProduct.id + 1 : 1;

    const newProduct = new Product({
      id: nextId,
      title,
      age,
      isbn,
      features,
      price,
      category,
      level,
      image: imageUrl,
      images: imageUrl ? [imageUrl] : [],
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
});

// ✅ Update Product (Admin only)
router.put("/:id", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const fields = ["title", "age", "isbn", "features", "price", "category", "level", "image", "images"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });

    // // Upload new image if provided
    // if (req.file) {
    //   const result = await new Promise((resolve, reject) => {
    //     const stream = cloudinary.uploader.upload_stream(
    //       { folder: "products" },
    //       (err, result) => (err ? reject(err) : resolve(result))
    //     );
    //     stream.end(req.file.buffer);
    //   });
    //   product.image = result.secure_url;
    //   product.images = [result.secure_url];
    // }

    await product.save();

    res.json({ success: true, message: "Product updated", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: "Update failed", error: error.message });
  }
});

// ✅ Get all products (Public)
router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: "i" };

    const products = await Product.find(filter).sort({ id: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching products", error: error.message });
  }
});

// ✅ Get single product by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Use findById instead of findOne({ id: ... })
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching product", error: error.message });
  }
});


// ✅ Get single product
router.get("/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching product", error: error.message });
  }
});

// ✅ Delete product (Admin only)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed", error: error.message });
  }
});

export default router;
