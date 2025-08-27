import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Plus, Minus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { ProductDetailSkeleton } from '../components/LoadingSkeleton';
import { fetchProductById } from '../data/products';
import { formatPrice, formatRating, capitalizeFirst } from '../utils/format';
import BookReader from '../components/BookReader';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const productData = await fetchProductById(parseInt(id));
        if (productData) {
          setProduct(productData);
        } else {
          setError('Product not found');
        }
      } catch (error) {
        console.error('Error loading product:', error);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="aspect-w-1 aspect-h-1">
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
              <div className="mb-6">
  <span className="text-3xl font-bold text-primary-600">
    {formatPrice(product.discountedPrice ? product.discountedPrice : product.price)}
  </span>
</div>

              {/* Description */}
              {/* <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div> */}

              {/* Quantity Selector */}
              <div className="mb-6">
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
              <div className="mt-8 pt-8 border-t border-primary-100">
  <h3 className="text-lg font-semibold text-primary-800 mb-4 font-serif">Product Features</h3>
  <ul className="space-y-2 text-gray-700">
    {[
      'High quality materials',
      'Customer satisfaction guaranteed',
    ].map((feature, idx) => (
      <li key={idx} className="flex items-center">
        <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
        {feature}
      </li>
    ))}
  </ul>
</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
