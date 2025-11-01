import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null; // hide if not needed

  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <div className="flex justify-center items-center space-x-2 pb-6">
      {/* Previous */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-100"
      >
        Prev
      </button>

      {/* Page Numbers */}
      {pages.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`px-3 py-1 border rounded-md transition-all duration-200 ${
            currentPage === num
              ? "bg-red-600 text-white border-red-600 hover:bg-red-700"
              : "hover:bg-gray-100 text-gray-800"
          }`}
        >
          {num}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-100"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
