import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="card animate-pulse">
      <div className="bg-gray-300 w-full h-64 rounded-t-lg"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
        <div className="flex items-center mb-2">
          <div className="h-4 bg-gray-300 rounded w-20"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-300 rounded w-16"></div>
          <div className="h-8 bg-gray-300 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

export const ProductDetailSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
        <div className="bg-gray-300 w-full h-96 rounded-lg"></div>
        <div>
          <div className="h-8 bg-gray-300 rounded mb-4"></div>
          <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3 mb-6"></div>
          <div className="h-12 bg-gray-300 rounded w-40"></div>
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};
