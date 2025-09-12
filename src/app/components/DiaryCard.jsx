"use client"
import DiaryBookFlip from "./DiaryBookFlip"

const DiaryCard = () => {
  return (
    <div className="flex-1 h-auto md:h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar">
      <h2 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-4 md:mb-6 font-cinzel">
        From the diary of Muhammad Nauman
      </h2>
      <div className="max-h-[60vh] md:max-h-[80vh] mx-auto">
        <DiaryBookFlip />
      </div>
     
    </div>
  )
}

export default DiaryCard
