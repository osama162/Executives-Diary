"use client";

const BookFlip = ({
  id,
  coverImage = "/images/cover-ed2.png",
  profileImage = "/images/nauman.jpeg",
  authorName = "Muhammad Nauman",
  first_name = "", // <-- NEW
  last_name = "", // <-- NEW
  diaryTitle = "", // <-- NEW
  industry = "",
  jobTitle = "",
  href = "/single-diary.html",
  notImage = true,
}) => {
  return (
    <>
      <style jsx>{`
        .book-flip-container {
          perspective: 1200px;
        }

        .book-flip {
          position: relative;
          transform-origin: 35% 50%;
          transform-style: preserve-3d;
          transition: transform 0.5s ease;
        }

        .book-flip::after {
          content: "";
          position: absolute;
          top: 3px;
          left: 98.5%;
          bottom: 3px;
          width: 60px;
          background: repeating-linear-gradient(
            to right,
            #f5f5f5,
            #f5f5f5 5px,
            #aaa 5px,
            #aaa 6px
          );
          transform-origin: 0 50%;
          transform: rotateY(90deg);
          transition: opacity 0.5s ease;
          opacity: 1;
        }

        .book-flip-container:hover .book-flip {
          transform: rotateY(-35deg);
        }

        .spiral-binding::before {
          content: "";
          position: absolute;
          top: 50%;
          height: 107%;
          width: 39px;
          left: -17px;
          z-index: 50;
          transform: translateY(-50%) scale(0.855);
          background-image: url("/images/Vector-Smart-Object.png");
          background-size: contain;
          background-repeat: no-repeat;
        }
      `}</style>
      <div className="w-full max-w-xs pt-4 sm:pt-8 md:pt-12 lg:pt-20 mb-3 sm:mb-2">
        <div className="book-flip-container w-[70%] sm:w-[75%] md:w-[80%] mx-auto">
          <div className="book-flip">
            <a
              href={`/Diaries/${id}`}
              className="block w-full spiral-binding relative"
            >
              <div className="relative">
                <img
                  src={coverImage}
                  alt="Book Cover"
                  className="object-cover relative w-full h-auto"
                />

                {/* Profile Image */}
                {notImage && (
                  <div className="absolute top-[70%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-16 sm:-mt-20">
                    <div className="w-[80px] h-[100px] sm:w-[100px] sm:h-[120px] md:w-[120px] md:h-[140px] relative">
                      <img
                        src={profileImage}
                        alt={`${authorName} profile`}
                        className="object-cover border-4 border-yellow-200 rounded w-full h-full"
                      />
                    </div>
                  </div>
                )}

                {/* Text Overlay */}
                {notImage && (
                  <div className="absolute top-[82%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] text-center">
                    <h5 className="text-white text-[8px] sm:text-[10px] md:text-[11px] font-bold tracking-[2px] sm:tracking-[3px] md:tracking-[4px] mb-0">
                      FROM THE DIARY OF
                    </h5>
                    <h5 className="text-white text-[8px] sm:text-[10px] md:text-[11px] font-bold tracking-[2px] sm:tracking-[3px] md:tracking-[4px] mt-1 mb-0">
                      {`${first_name}  ${last_name}` || authorName}
                    </h5>
                  </div>
                )}
              </div>
            </a>
          </div>

          {/* Tag Section */}
          {notImage && (
            <div className="mt-2 sm:mt-4 text-center sm:text-left">
              <div className="inline-block px-2 sm:px-3 py-1 sm:py-2 bg-[#f5df70] text-black text-xs sm:text-sm rounded">
                {industry}
              </div>
              <h4
                className="mt-2 sm:mt-3 h-[40px] sm:h-[50px] text-gray-700 text-[12px] sm:text-[14px] md:text-[15px] font-bold leading-relaxed block line-clamp-2 sm:line-clamp-1"
                title={jobTitle}
              >
                {jobTitle}
              </h4>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BookFlip;
