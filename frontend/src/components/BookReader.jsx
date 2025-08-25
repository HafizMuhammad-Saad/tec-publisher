import React from "react";
import HTMLFlipBook from "react-pageflip";

const BookReader = ({ pages }) => {
  return (
    <div className="flex justify-center">
      <HTMLFlipBook
        width={400}
        height={600}
        showCover={true}
        className="shadow-lg"
        style={{ margin: "0 auto" }}
      >
        {pages.map((page, index) => (
          <div
            key={index}
            className="bg-white flex items-center justify-center text-lg font-serif p-6"
          >
            {typeof page === "string" ? (
              <img
                src={page}
                alt={`Page ${index + 1}`}
                className="w-full h-full object-contain"
              />
            ) : (
              page
            )}
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
};

export default BookReader;
