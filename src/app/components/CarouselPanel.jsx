import React from "react";
import EntryCard from "./EntryCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CarouselPanel = ({ title, entry, onPrev, onNext, isFirst, isLast }) => (
  <div className="relative px-3 sm:px-4 pt-4 sm:pt-6 pb-4 min-h-[500px] sm:min-h-[600px] border-b lg:border-b-0 lg:border-r-[6px] border-[#2d2756] flex flex-col justify-start">
    <h2 className="text-center font-cinzel text-[#424242] text-[20px] sm:text-[24px] md:text-[31px] lg:text-[41px] mb-4 sm:mb-6 uppercase">
      {title}
    </h2>

    <EntryCard entry={entry} />

    <div className="mt-4 sm:mt-6 flex justify-center gap-2">
      {/* Prev Button */}
      <button
        onClick={onPrev}
        disabled={isFirst}
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-md flex items-center justify-center 
          ${
            isFirst
              ? "bg-[#a69fb0] cursor-not-allowed"
              : "bg-[#2d2756] hover:bg-[#1e1b45] cursor-pointer"
          } 
          text-white transition-colors duration-200`}
      >
        <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
      </button>

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={isLast}
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-md flex items-center justify-center 
          ${
            isLast
              ? "bg-[#a69fb0] cursor-not-allowed"
              : "bg-[#2d2756] hover:bg-[#1e1b45] cursor-pointer"
          } 
          text-white transition-colors duration-200`}
      >
        <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
      </button>
    </div>
  </div>
);

export default CarouselPanel;
