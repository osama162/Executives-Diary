"use client";

import Answer from "./Answer";

const AnswerPost = () => {
  return (
    <div className="flex-1 h-auto md:h-[calc(100vh-100px)] ">
    <h2 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-4 md:mb-6 font-cinzel">
    Answer
    </h2>
    <div className="max-h-[60vh] md:max-h-[80vh] mx-auto">
      <Answer />
    </div>
    
  </div>
  );
};

export default AnswerPost