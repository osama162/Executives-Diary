"use client";

const Answer = () => {
  return (
  <div>
    <h2 className="heading_ed_book text-uppercase  uppercase font-times text-center mt-5 ">
            Life and Experiences
          </h2>
          <ol className="mt-3 list-questio pl-4 list-decimal space-y-1">
            <li className="mb-1">
              <a className="pointer cursor-pointer transition-colors hover:text-[#10b981]">
                Hi! Thank you for joining us. Can you please tell us a little
                bit about yourself? Some fun facts and anecdotes from your life.
              </a>
            </li>
            <li className="mb-1">
              <a className="pointer cursor-pointer transition-colors hover:text-[#10b981]">
                Where did you get an education? Has your schooling helped shape
                you to be the person that you are today?
              </a>
            </li>
            <li className="mb-1">
              <a className="pointer cursor-pointer transition-colors hover:text-[#10b981]">
                Explain some facts about Muhammad Nauman that the world doesn't
                know; how would you describe yourself?
              </a>
            </li>
            <li className="mb-1">
              <a className="pointer cursor-pointer transition-colors hover:text-[#10b981]">
                Some Photograph from My Life as Digital Nomad
              </a>
            </li>
            <li className="mb-1">
              <a className="pointer cursor-pointer transition-colors hover:text-[#10b981]">
                Tell us about your career journey where you started and ended up
                where are you today.
              </a>
            </li>
            <li className="mb-1">
              <a className="pointer cursor-pointer transition-colors hover:text-[#10b981]">
                My favourite place for vacations
              </a>
            </li>
          </ol>

          {/* Professional Career */}
          <h2 className="heading_ed_book text-uppercase font-times uppercase text-center mt-5">
            Professional Career
          </h2>
          <ol className="mt-3 list-questio pl-4 list-decimal space-y-1">
            <li className="mb-1">
              <a className="pointer cursor-pointer transition-colors hover:text-[#10b981]">
                What was the biggest challenge you faced in your career and how
                did you overcome it? Who supported you the most in your career?
              </a>
            </li>
            <li className="mb-1">
              <a className="pointer cursor-pointer transition-colors hover:text-[#10b981]">
                Almost every successful individual out here has a role model or
                mentor; whom would you credit for your success and their part in
                your career?
              </a>
            </li>
            <li className="mb-1">
              <a className="pointer cursor-pointer transition-colors hover:text-[#10b981]">
                How much will I make?
              </a>
            </li>
          </ol>

          {/* Leadership Advice */}
          <h2 className="heading_ed_book text-uppercase font-times uppercase text-center mt-5">
            Leadership Advice
          </h2>
          <ol className="mt-3 list-questio pl-4 list-decimal space-y-1">
            <li className="mb-1">
              <a className="pointer cursor-pointer transition-colors hover:text-[#10b981]">
                What do you think about Executives Diary?
              </a>
            </li>
            <li className="mb-1">
              <a className="pointer cursor-pointer transition-colors hover:text-[#10b981]">
                We discussed this concept a lot, and you aim to take executives
                Diary into blockchain and AI technology in the future; How do
                you foresee that progression, can you share your thoughts with
                our readers?
              </a>
            </li>
            <li className="mb-1">
              <a className="pointer cursor-pointer transition-colors hover:text-[#10b981]">
                Muhammad, I am sure you are an avid reader, can you recommend
                some books for our readers?
              </a>
            </li>
            <li className="mb-1">
              <a className="pointer cursor-pointer transition-colors hover:text-[#10b981]">
                Being a Digital Marketing Industry Executive, how do you foresee
                the future of digital marketing?
              </a>
            </li>
          </ol>
  </div>
  );
};

export default Answer;
