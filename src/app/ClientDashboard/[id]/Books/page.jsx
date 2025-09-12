"use client";
import Image from "next/image";
import EditBook from "../../../components/EditBook";
import BookPost from "../../../components/BookPost";

export default function BooksPage() {
  return (
    <div className="relative w-full min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
        {/* Left: Dashboard / Story */}
        <div className="flex items-center text-gray-600 text-sm md:text-base">
          <span className="font-medium">Dashboard</span>
          <span className="mx-2">/</span>
          <span className="font-semibold text-gray-800">Books</span>
        </div>

        {/* Right: Add Question Button */}
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 md:px-6 py-2 md:py-3  flex items-center gap-2 text-sm md:text-base font-medium transition-colors">
          <span className="text-lg">+</span>
          Add Books
        </button>
      </div>

      {/* Main Content Container */}
      <div className="relative px-4 md:px-8">
        {/* Left Navigation Arrow */}
        <button
          className="absolute left-5.5 top-1/2 -translate-y-1/2 z-20 bg-emerald-500 hover:bg-emerald-600 text-white w-8 h-12 md:w-10 md:h-16 flex items-center justify-center transition-colors"
          aria-label="Previous"
        >
          <svg
            className="w-4 h-4 md:w-5 md:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        

        {/* Right Navigation Arrow */}
        <button
          className="absolute right-5.5 top-1/2 -translate-y-1/2 z-20 bg-emerald-500 hover:bg-emerald-600 text-white w-8 h-12 md:w-10 md:h-16  flex items-center justify-center transition-colors"
          aria-label="Next"
        >
          <svg
            className="w-4 h-4 md:w-5 md:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Main Story Container */}
        <div
          className="
            relative mx-auto
            w-full max-w-[1700px]
            h-auto md:h-[640px] min-h-[600px]
            border-[#1e1c4d] border-[12px] md:border-[19px] border-x-[20px] md:border-x-[30px]
            rounded-[8px] md:rounded-[10px]
            shadow-[0_4px_16px_rgba(0,0,0,0.15)] md:shadow-[0_8px_24px_rgba(0,0,0,0.15)]
          "
        >
          {/* Inner white sheet */}
          <div
            className="
              bg-white relative z-10 h-full
              overflow-hidden
              rounded-[6px] md:rounded-[8px]
            "
          >
            {/* 3-column grid: left | divider | right */}
            <div
              className="
                grid h-full
                [grid-template-columns:minmax(0,1fr)_4px_minmax(0,1fr)]
              "
            >
              {/* Left (scrollable) */}
              <div
                className="
                  flex items-start justify-center
                  px-4 md:px-10 py-6 md:py-10 h-full
               
                "
              >
                <BookPost />
              </div>

              {/* Divider in its own column so scrollbars never overlap it */}
              <div className="bg-[#2d3a6b] hidden md:block" aria-hidden />

              {/* Right */}
              <div className="flex items-start px-4 md:px-10 py-6 md:py-10 h-full">
                <EditBook />
              </div>
            </div>
          </div>

          {/* Ribbon */}
          <div className="absolute -bottom-13 right-7 z-0">
            <Image
              src="/images/SHAPE.png"
              alt="ribbon"
              height={120}
              width={120}
              priority
            />
          </div>
        </div>
      </div>
    </div>
    
  );
}
