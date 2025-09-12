'use client'
import Image from 'next/image';

const BookFlipLong = ({
    coverImage,
    profileImage,
    authorName,
    industry,
    jobTitle,
    firstName,
    lastName,
    href,
    size = "normal",
}) => {
    const isLarge = size === "large";

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
          content: '';
          position: absolute;
          top: 3px;
          left: 98.5%;
          bottom: 3px;
          width: ${isLarge ? '80px' : '60px'};
          background: repeating-linear-gradient(to right, #f5f5f5, #f5f5f5 5px, #aaa 5px, #aaa 6px);
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
          width: ${isLarge ? '65px' : '39px'};
          left: ${isLarge ? '-30px' : '-17px'};
          z-index: 50;
          transform: translateY(-50%) scale(0.855);
          background-image: url('/images/Vector-Smart-Object.png');
          background-size: contain;
          background-repeat: no-repeat;
        }
        
        .read-diary-btn {
          position: absolute;
          top: 45%;
          right: -10%;
          width: 195px;
          height: 80px;
          background-image: url('/images/read-bg copy.png');
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.3s ease;
          z-index: 10;

        .read-diary-btn:hover {
          transform: translateY(-2px);
        }
        
        .read-diary-btn-text {
          color: #333;
          position: relative;
          bottom:15%;
          font-weight: bold;
          font-size: 16px;
          text-align: center;
          white-space: nowrap;
          pointer-events: none;
        }
        }
      `}</style>

            <div className={`w-full ${isLarge ? 'max-w-lg' : 'max-w-xs'} pt-8 md:pt-20 sm:pt-12 pb-14`}>
                <div className="book-flip-container w-[85%] mx-auto hover:shadow-none shadow-[26px_23px_9px_#e2e2e2] bg-transparent">
                    <div className="book-flip relative">
                        <a
                            href={href}
                            className="block w-full spiral-binding relative"
                        >
                            <div className="relative w-full">
                                <Image
                                    src={coverImage}
                                    alt="Book Cover"
                                    width={isLarge ? 500 : 300}
                                    height={isLarge ? 650 : 400}
                                    className="w-full h-full object-cover relative rounded-lg"
                                    priority
                                />

                                {/* Profile Image Overlay */}
                                <div className={`absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${isLarge ? '-mt-24' : '-mt-20'}`}>
                                    <div className={`${isLarge ? 'w-[240px] h-[280px]' : 'w-[120px] h-[140px]'} relative`}>
                                        <Image
                                            src={profileImage}
                                            alt={`${authorName} profile`}
                                            fill
                                            className="object-cover border-4 border-[#efe3a9] rounded"
                                        />
                                    </div>
                                </div>

                                {/* Text Overlay */}
                                <div className={`absolute top-[78%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] text-center`}>
                                    <h5 className={`text-white ${isLarge ? 'text-lg' : 'text-xs'} font-bold tracking-[4px] mb-1`}>
                                        FROM THE DIARY OF
                                    </h5>
                                    <h5 className={`text-white ${isLarge ? 'text-xl' : 'text-xs'} font-bold tracking-[4px] mt-1 mb-0 capitalize`}>
                                       {`${firstName}  ${lastName}` || authorName}
                                    </h5>
                                    {isLarge && (
                                        <p className="text-white text-base mt-2 font-medium">
                                            {industry}
                                        </p>
                                    )}
                                </div>

                                {isLarge && (
                                    <div className="read-diary-btn">
                                        <div className="read-diary-btn-text">
                                            Read the Diary
                                        </div>
                                    </div>
                                )}
                            </div>
                        </a>
                    </div>

                    {!isLarge && (
                        <div className="mt-4 text-center sm:text-left">
                            <a
                                href="#"
                                className="inline-block px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
                            >
                                {industry}
                            </a>
                            <h4 className="mt-3 text-gray-700 text-[15px] font-bold leading-relaxed block w-full">
                                {jobTitle.split(' ').map((word, index) => (
                                    <span key={index}>
                                        {word}
                                        {index === 1 && <br />}
                                        {index > 1 && index < jobTitle.split(' ').length - 1 && ' '}
                                    </span>
                                ))}
                            </h4>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default BookFlipLong;