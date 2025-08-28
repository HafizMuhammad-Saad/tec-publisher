import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/slider.jpeg",
      title: "tec Publication",
      description: "Interactive learning books for young minds",
      ctaText: "Explore Series",
      ctaLink: "/products?category=brainy-builder"
    },
    {
      image: "/world-book-day-template-design/11646243.jpg",
      title: "World Book Day 2023",
      description: "Comprehensive math books for all grades",
      ctaText: "View Math Books",
      ctaLink: "/products?category=mathematics"
    },
    {
      image: "/back-school-facebook-cover-banner-template/back_to_school_facebook_cover_banner_19.jpg",
      title: "World Book Day 2023",
      description: "Comprehensive math books for all grades",
      ctaText: "View Math Books",
      ctaLink: "/products?category=mathematics"
    },
    // {
    //   image: "/a3/sciencebooks_7/science_1.jpg",
    //   title: "Science Explorers",
    //   description: "Discover the wonders of science",
    //   ctaText: "Browse Science",
    //   ctaLink: "/products?category=science"
    // },
    // {
    //   image: "/a3/workbook/english_1.jpg",
    //   title: "Workbook Collection",
    //   description: "Practice makes perfect with our workbooks",
    //   ctaText: "See Workbooks",
    //   ctaLink: "/products?category=workbooks"
    // },
    // {
    //   image: "/a4/readers/english_1.jpg",
    //   title: "Reading Adventures",
    //   description: "Engaging readers for all reading levels",
    //   ctaText: "Find Readers",
    //   ctaLink: "/products?category=readers"
    // }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  return (
    <div className="relative w-full h-[65vh] overflow-hidden">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-contain bg-center bg-primary-50 bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
            
            {/* Content Overlay */}
            {/* <div className="relative z-10 flex items-center justify-center h-full">
              <div className="text-center text-white max-w-4xl px-4">
                <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 animate-fade-in">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-primary-100 animate-fade-in">
                  {slide.description}
                </p>
                <Link
                  to={slide.ctaLink}
                  className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 hover:scale-105 transition-all duration-300 shadow-lg animate-slide-up"
                >
                  {slide.ctaText}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div> */}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
