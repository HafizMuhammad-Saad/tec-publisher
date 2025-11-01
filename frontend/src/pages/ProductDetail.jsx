import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Plus, Minus, BookOpen, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { ProductDetailSkeleton } from '../components/LoadingSkeleton';
import { fetchProductById } from '../data/products';
import { formatPrice, capitalizeFirst } from '../utils/format';
import axios from 'axios';
import toast from 'react-hot-toast';
import BookReader from '../components/BookReader';

  const API_BASE = import.meta.env.VITE_API_BASE;


const parseFeatures = (featuresString) => {
  const headerMatch = featuresString?.match(/^(.*?):/);
  const header = headerMatch ? headerMatch[1].trim() : 'Key Features';

  const featureList = featuresString
    .replace(header, '')
    .replace(':', '')
    .split('✅')
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => p.startsWith('🌈') ? p.substring(1).trim() : p);

  return { header, featureList };
};

// --- FEATURE LIST COMPONENT (Re-used for feature rendering) ---
const FeatureList = ({ features }) => {
  const { header, featureList } = parseFeatures(features);

  return (
    <div className="p-6 md:p-8 bg-rose-50 rounded-2xl border border-indigo-200">
      <h3 className="text-xl sm:text-2xl font-extrabold text-gray-800 mb-5 border-b-2 border-indigo-300 pb-3 flex items-center">
        <BookOpen className="w-6 h-6 mr-3 text-rose-700" />
        {header}
      </h3>

      <ul className="space-y-1 text-gray-700">
        {featureList.map((feature, index) => (
          <li key={index} className="flex items-start transition duration-200 ease-in-out hover:bg-rose-100/50 p-2 rounded-lg -m-2">
            <div className="flex-shrink-0 w-5 h-5 bg-rose-600 rounded-full mr-3 mt-1 flex items-center justify-center shadow-md">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
            <span className="text-base leading-relaxed font-medium">
              {feature.replace(/[,]$/, '').trim()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentIndex(prev =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentIndex(prev =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };


  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const loadProduct = async () => {
  //     try {
  //       setLoading(true);
  //       const productData = await fetchProductById(parseInt(id));
  //       if (productData) {
  //         setProduct(productData);

  //         if (productData) {
  //           setProduct(productData);
  //           setSelectedImage(productData.images ? productData.images[0] : productData.image);
  //         }
  //       } else {
  //         setError('Product not found');
  //       }
  //     } catch (error) {
  //       console.error('Error loading product:', error);
  //       setError('Failed to load product');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (id) {
  //     loadProduct();
  //   }


  // }, [id]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_BASE}/products/${id}`);
        setProduct(data);
        setSelectedImage(data.images?.[0] || data.image);
      } catch (err) {
        console.error(err);
        setError("Product not found");
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadProduct();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setQuantity(1);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Product not found'}</h2>
            <button
              onClick={() => navigate('/products')}
              className="btn-primary inline-flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="btn-outline mb-6 inline-flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            {/* <div className="aspect-w-1 aspect-h-1">
              {
                product.flipbook ? (
                  <iframe allowFullScreen="allowfullscreen" allow="clipboard-write" scrolling="no" className="fp-iframe" src={product.flipbook} style={{border: '1px solid lightgray', width: '100%', height: '400px'}}></iframe>
                ) : (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain object-center bg-primary-50 rounded-lg shadow-md"
                  />
                )
              }
                       </div> */}
           
            {/* Product Image Carousel */}
{/* <div className="relative flex flex-col items-center">
  <div className="relative w-full aspect-w-1 aspect-h-1">
    {
      product.images ? (
        <img
          src={product.images[currentIndex]}
          alt={`${product.title} image ${currentIndex + 1}`}
          className="w-full h-full object-contain bg-primary-50 rounded-lg shadow-md"
        />
      ) : (
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain object-center bg-primary-50 rounded-lg shadow-md"
        />
      )
    }


    <button
      onClick={handlePrevImage}
      className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-rose-200/80 p-2 rounded-full shadow hover:bg-rose-200 transition"
    >
      <ChevronLeft className="w-6 h-6 text-gray-600" />
    </button>

    <button
      onClick={handleNextImage}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-rose-200/80 p-2 rounded-full shadow hover:bg-rose-200 transition"
    >
      <ChevronRight className="w-6 h-6 text-gray-600" />
    </button>
  </div>

  <div className="flex mt-3 space-x-2">
    {product.images ? (product.images.map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrentIndex(index)}
        className={`w-3 h-3 rounded-full ${
          currentIndex === index ? 'bg-primary-600' : 'bg-primary-200'
        }`}
      />
    ))) : null}
  </div>
</div> */}

<div className="relative flex flex-col items-center">
  {/* Main Image Container */}
  <div className="relative w-full aspect-w-1 aspect-h-1">
     
    {/* ✅ CASE 1: Multiple images */}
    {product.images && product.images.length > 1 ? (
      <>
        <img
          src={product.images[currentIndex]}
          alt={`${product.title} image ${currentIndex + 1}`}
          className="w-full h-full object-contain bg-primary-50 rounded-lg shadow-md"
        />

        {/* Navigation Arrows */}
        <button
          onClick={handlePrevImage}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-rose-200/80 p-2 rounded-full shadow hover:bg-rose-200 transition"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <button
          onClick={handleNextImage}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-rose-200/80 p-2 rounded-full shadow hover:bg-rose-200 transition"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </>
    ) : (
      /* ✅ CASE 2: Single image (either from images[0] or image) */
      (() => {
        const singleImage =
          (product.images && product.images[0]) || product.image;
        return singleImage ? (
          <img
            src={singleImage}
            alt={product.title}
            className="w-full h-full object-contain bg-primary-50 rounded-lg shadow-md"
          />
        ) : null;
      })()
    )}
  </div>

  {/* ✅ Dots / Indicators (only if multiple images) */}
  {product.images && product.images.length > 1 && (
    <div className="flex mt-3 space-x-2">
      {product.images.map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentIndex(index)}
          className={`w-3 h-3 rounded-full ${
            currentIndex === index ? 'bg-primary-600' : 'bg-primary-200'
          }`}
        />
      ))}
    </div>
  )}
</div>



            {/* Product Information */}
            <div>
              <div className="mb-4">
                <span className="inline-block bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full mb-2">
                  {capitalizeFirst(product.category)}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.title}
                </h1>
              </div>



              {/* Price */}
              <div className="mb-4">
                <span className="text-3xl font-bold text-primary-600">
                  {formatPrice(product.discountedPrice ? product.discountedPrice : product.price)}
                </span>

              </div>
                 {product?.isbn ? (
        <span className=' text-lg text-blue-800'>ISBN: {product.isbn}</span>
      ) : (
        <span className=' text-lg text-blue-800'>ISBN: N/A</span>
      )}

              {/* Description */}
              {/* <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div> */}

              {/* Quantity Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={decrementQuantity}
                    className="p-2 border border-primary-200 rounded-md hover:bg-primary-50 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-primary-600" />
                  </button>
                  <span className="text-xl font-semibold min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="p-2 border border-primary-200 rounded-md hover:bg-primary-50 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-primary-600" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full py-3 text-lg flex items-center justify-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart – {formatPrice((product.discountedPrice ?? product.price) * quantity)}</span>
              </button>

              {/* Product Features */}
              {/* <div className="mt-8 pt-8 border-t border-primary-100">
  <h3 className="text-lg font-semibold text-primary-800 mb-4 font-serif">Product Features</h3>
  <ul className="space-y-2 text-gray-700">

      <li className="flex items-center">
        <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
        {product.features}
      </li>
  </ul>
</div> */}
              <div className=" pt-8 border-t border-gray-100">
                {/* Applied user requested font-serif and text/spacing from snippet, mapped primary-800 to indigo-800 */}
                <h3 className="text-lg font-semibold text-rose-800 mb-4 font-serif">Product Features</h3>
                {/* The FeatureList component handles the list formatting and parsing */}
                <FeatureList features={product?.features} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
