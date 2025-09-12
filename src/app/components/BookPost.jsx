import React from "react";
import BookFlip from "./BookFlip";

const BookPost = () => {
    return (
      <div className="flex-1 h-auto md:h-[calc(100vh-100px)]">
        {/* Title */}
        <h2 className="text-xl md:text-xl font-bold  text-center text-gray-800 mb-4 md:mb-6 font-muli">
          SDF
        </h2>
  
        {/* Book wrapper (centered) */}
        <div className="flex justify-center">
          <div className="max-h-[40vh] md:max-h-[40vh]">
            <BookFlip
              key={1}
              coverImage={"/images/flipwhite.jpg"}
              profileImage={""}
              authorName={""}
              industry={""}
              jobTitle={""}
              href={""}
              notImage={false}
            />
          </div>
        </div>
  
        {/* Divider + Delete (always left aligned) */}
        <div className="w-full mt-6 md:mt-8 border-t border-gray-200">
          <div className="mt-3 text-left">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm text-gray-800 hover:text-red-600 ml-4"
              onClick={() => console.log("Delete book clicked")}
            >
              {/* Trash icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <path d="M19 6l-1 14a2 2 0 0 1-2-2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
              </svg>
              Delete Book
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default BookPost;
