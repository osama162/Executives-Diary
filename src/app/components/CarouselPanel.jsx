import React from "react"
import EntryCard from "./EntryCard"
import { ChevronLeft, ChevronRight } from "lucide-react"

const CarouselPanel = ({ title, entry, onPrev, onNext, isFirst, isLast }) => (
  <div className="relative px-4 pt-6 pb-4 min-h-[600px] border-b md:border-b-0 md:border-r-[6px] border-[#2d2756] flex flex-col justify-start">
    <h2 className="text-center font-cinzel text-[#424242] text-[36px] md:text-[41px]  mb-6 uppercase">
      {title}
    </h2>

    <EntryCard entry={entry} />

    <div className="mt-6 flex justify-center gap-0">
      {/* Prev Button */}
      <button
        onClick={onPrev}
        disabled={isFirst}
        className={`w-12 h-12 rounded-md flex items-center justify-center 
          ${isFirst ? "bg-[#a69fb0] cursor-not-allowed" : "bg-[#2d2756] hover:bg-[#1e1b45] cursor-pointer"} 
          text-white transition-colors duration-200`}
      >
        <ChevronLeft size={18} />
      </button>

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={isLast}
        className={`w-12 h-12 rounded-md flex items-center justify-center 
          ${isLast ? "bg-[#a69fb0] cursor-not-allowed" : "bg-[#2d2756] hover:bg-[#1e1b45] cursor-pointer"} 
          text-white transition-colors duration-200`}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  </div>
)

export default CarouselPanel
