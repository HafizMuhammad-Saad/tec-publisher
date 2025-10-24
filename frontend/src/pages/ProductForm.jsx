import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ImageUpload from "../components/ImageUpload";

const ProductForm = ({ mode = "create" }) => {
  const [product, setProduct] = useState({
    title: "",
    age: "",
    isbn: "",
    features: "",
    price: "",
    level: "",
    category: "",
    image: "",
    images: [],
  });
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (mode === "edit" && id) {
      axios
        .get(`/api/products/${id}`)
        .then((res) => {
            console.log(res.data);
          setProduct(res.data);
          
          setPreview(res.data.images);
        })
        .catch(() => toast.error("Failed to load product"));
    }
  }, [mode, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

//     setUploading(true);
//     try {
//       const res = await axios.post(
//         `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
//         formData
//       );
//       setProduct((prev) => ({ ...prev, image: res.data.secure_url }));
//       setPreview(res.data.secure_url);
//       toast.success("Image uploaded");
//     } catch (err) {
//       toast.error("Image upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

// const handleImageUpload = async (e) => {
//   const files = Array.from(e.target.files);
//   if (!files.length) return;

//   setUploading(true);

//   try {
//     const uploadedUrls = [];

//     // Loop through all selected files and upload each
//     for (const file of files) {
//       const formData = new FormData();
//       formData.append("file", file); // "file" must match multer's field name
//       formData.append("folder", "products");

//       const { data } = await axios.post(" /api/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       uploadedUrls.push(data.url);
//     }

//     // Optionally set main image if none exists
//     setProduct((prev) => ({
//       ...prev,
//       image: prev.image || uploadedUrls[0],
//     }));

//     toast.success("Images uploaded successfully!");
//   } catch (error) {
//     console.error(error);
//     toast.error("Image upload failed");
//   } finally {
//     setUploading(false);
//   }
// };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "edit") {
        await axios.put(`/api/products/${id}`, product);
        toast.success("Product updated successfully");
      } else {
        await axios.post(" /api/products", product);
        toast.success("Product added successfully");
      }
      navigate("/admin/products");
    } catch (error) {
      toast.error("Failed to save product");
      console.log(error);
      
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-6">
          {mode === "edit" ? "Edit Product" : "Add New Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={product.title}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                name="category"
                value={product.category}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md px-3 py-2"
                placeholder="e.g. readers, workbook"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input
                type="text"
                name="age"
                value={product.age}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Level</label>
              <input
                type="text"
                name="level"
                value={product.level}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Features / Description</label>
            <textarea
              name="features"
              value={product.features}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md px-3 py-2 h-24"
              placeholder="Write product highlights..."
            />
          </div>

          <ImageUpload
            initialImages={product.images || []}
  onImagesChange={(urls) =>
    setProduct((prev) => ({ ...prev, images: urls }))
  }
/>



          {/* Submit */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              {mode === "edit" ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
