import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Star, Users, Shield, LockOpen, PencilRuler, Globe2, GlobeIcon, UserCircleIcon, UserCircle2, Users2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/LoadingSkeleton';
import { fetchProducts } from '../data/products';
import HeroSlider from '../components/HeroSlider';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const products = await fetchProducts();
        // get products that isSet true
        const sets = products.filter(product => product.isSet === true);

        setFeaturedProducts(sets);
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  const features = [
  {
    icon: LockOpen,
    title: 'Digital App Access',
    description: 'Read your favorite books anytime, anywhere with our seamless digital app.'
  },
  {
    icon: PencilRuler, // or a writing-related icon
    title: 'Manuscript Feedback & Coaching',
    description: 'Get in-depth editorial guidance to shape your manuscript into a market-ready book with clear voice and structure.'
  },

  {
    icon: GlobeIcon, // for reach/distribution
    title: 'Global Distribution Support',
    description: 'We help place your book on major platforms like Amazon, IngramSpark, and more — with professional listings.'
  },
  {
    icon: Users2, // for community aspect
    title: 'Community & Launch Support',
    description: 'Access author groups, launch strategies, and post-publish coaching to ensure your book gets the attention it deserves.'
  }
];

  return (
    <div className="min-h-52">
      {/* Hero Section - Replaced with Slider */}
      <HeroSlider />

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-primary-50 to-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
  <h2 className="text-3xl font-bold text-primary-800 mb-4">Your Publishing Partner</h2>
  <p className="text-lg text-gray-600">
    We combine expert consultancy with premium publishing services to help authors succeed.
  </p>
</div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {features.map((feature, index) => (
        <div
          key={index}
          className="text-center p-6 rounded-lg border border-primary-100 hover:border-primary-300 hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 text-white rounded-full mb-4 shadow-md">
            <feature.icon className="w-8 h-8" />
          </div> 
          <h3 className="text-xl font-semibold text-primary-800 mb-2">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600">Check out our most popular items</p>
          </div>
          
          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="text-center">
                <Link
                  to="/products"
                  className="btn-secondary inline-flex items-center px-6 py-3"
                >
                  View All Products
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 bg-gradient-to-r from-primary-700 to-primary-500 text-white">
  <div className="absolute inset-0 bg-[url('/images/paper-texture.png')] opacity-10"></div>
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 className="text-3xl font-bold mb-4">Ready to Start Your Next Chapter?</h2>
    <p className="text-xl text-primary-100 mb-8">
      Discover stories, ideas, and knowledge waiting for you
    </p>
    <Link
      to="/products"
      className="bg-white text-primary-700 font-semibold px-8 py-4 text-lg rounded-lg shadow-lg hover:bg-primary-50 hover:scale-105 transition-all duration-300 inline-flex items-center"
    >
      Browse Books
      <ArrowRight className="ml-2 w-6 h-6" />
    </Link>
  </div>
</section>
    </div>
  );
};

export default Home;
