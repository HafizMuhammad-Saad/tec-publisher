import { useState, useCallback } from "react";
import axios from "axios";
import { Upload, X } from "lucide-react";
import { cn } from "../../utils/cn";
import Button from "./Button";
import toast from "react-hot-toast";
import { useEffect } from "react";
// import { toast } from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_BASE;

const ImageUpload = ({
  onImagesChange,
    initialImages = [], // 👈 new prop

  maxImages = 10,
  className,
  error,
  label = "Upload Images",
}) => {
  const [images, setImages] = useState([]); // {id, url, name, uploading}
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

 useEffect(() => {
    if (initialImages.length > 0) {
      const formatted = initialImages.map((url, i) => ({
        id: Date.now() + i,
        url,
        name: `existing-${i}`,
        uploading: false,
      }));
      setImages(formatted);
    }
  }, [initialImages]);  
  const handleImageChange = useCallback(
    (newImages) => {
      setImages(newImages);
      
      onImagesChange(newImages.map((img) => img.url)); // send URLs only to parent
    },
    [onImagesChange]
  );

  // Handle file input change
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    addImages(files);
  };

  const addImages = async (files) => {
    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    if (images.length + validFiles.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    const newImages = validFiles.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file), // local preview
      name: file.name,
      uploading: true,
    }));

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    setUploading(true);

    try {
      const uploaded = [];

      for (const img of newImages) {
        const formData = new FormData();
        formData.append("file", img.file);
        formData.append("folder", "products");

        const { data } = await axios.post(
          `${BASE_URL}/upload`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        uploaded.push({
          ...img,
          url: data.url, // backend URL
          uploading: false,
        });
      }

      const merged = updatedImages.map((img) => {
        const uploadedImg = uploaded.find((u) => u.name === img.name);
        return uploadedImg || img;
      });

      toast.success("Images uploaded successfully!");
      handleImageChange(merged);
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (imageId) => {
    const updatedImages = images.filter((img) => img.id !== imageId);
    const imageToRemove = images.find((img) => img.id === imageId);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.url);
    }
    handleImageChange(updatedImages);
  };

  // Drag-drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    addImages(files);
  };

  return (
    <div className={cn("w-full", className)}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {/* Upload Area */}
      <label htmlFor="image-upload" className="text-primary-600 cursor-pointer hover:text-primary-700">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
            dragOver ? "border-primary-400 bg-primary-50" : "border-gray-300",
            error && "border-red-300"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />

          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              drag and drop images here, or{" "}
              <span className="text-primary-600 underline">upload files</span>
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to 10 MB hver (max {maxImages} images)
            </p>
          </div>
        </div>
      </label>

      {uploading && (
        <p className="mt-2 text-sm text-gray-500">Uploading images...</p>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Uploaded Images ({images.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                  {image.uploading && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center text-gray-600 text-sm">
                      Uploading...
                    </div>
                  )}
                </div>

                {!image.uploading && (
                  <Button
                    variant="danger"
                    size="sm"
                    className="absolute -top-2 -right-2 w-8 h-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(image.id)}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}

                <p className="mt-1 text-xs text-gray-500 truncate">
                  {image.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
