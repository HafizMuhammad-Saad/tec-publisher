import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true }, // old product id
    title: { type: String, required: true },
    age: { type: String },
    isbn: { type: String },
    features: { type: String },
    price: { type: Number, required: true },
    image: { type: String }, // main image (Cloudinary URL)
    images: [{ type: String }], // gallery
    level: { type: String },
    category: { type: String },
    // slug: { type: String, unique: true },
  },
  { timestamps: true }
);

ProductSchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }
  next();
});

export default mongoose.model("Product", ProductSchema);
