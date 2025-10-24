import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import path from "path";
import products from "../data/products.js"; // adjust path
import connectDB from '../config/database.js';

dotenv.config();

async function uploadImage(localPath) {
  if (!localPath || localPath.startsWith("http")) return localPath;
  const fullPath = path.resolve(`.${localPath}`);
  if (!fs.existsSync(fullPath)) {
    console.warn("Missing file:", fullPath);
    return null;
  }

  const result = await cloudinary.uploader.upload(fullPath, {
    folder: "products",
  });
  return result.secure_url;
}

// function slugify(str) {
//   if (!str) return null;
//   return str
//     .toLowerCase()
//     .trim()
//     .replace(/[^\w\s-]/g, "") // remove non-word chars
//     .replace(/\s+/g, "-");    // replace spaces with dash
// }

async function importData() {
  await connectDB();
//   await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");

  for (const item of products) {
    try {
      const mainUrl = await uploadImage(item.image);
      const imageUrls = [];
      if (item.images && item.images.length > 0) {
        for (const img of item.images) {
          const url = await uploadImage(img);
          if (url) imageUrls.push(url);
        }
      }
// const slug = slugify(item.title);

      const doc = {
        ...item,
        //   slug,
        image: mainUrl || imageUrls[0],
        images: imageUrls.length ? imageUrls : [mainUrl],
      };

      await Product.findOneAndUpdate({ id: item.id }, doc, { upsert: true });
      console.log(`✅ Imported: ${item.title}`);
    } catch (err) {
      console.error("❌ Error:", item.title, err.message);
    }
  }

  console.log("✅ Done importing all products");
  await mongoose.disconnect();
}

importData();
