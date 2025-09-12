'use client';

import Image from 'next/image';
import Link from 'next/link';

const DiaryBookFlip = ({
  id = 1,
  coverImage = '/images/cover-ed2.png',
  profileImage = '/images/nauman.jpeg',
  authorName = 'Muhammad Nauman',
  href = '/single-diary.html',
  
}) => {
  return (
    <>
      <style jsx>{`
        .book-flip-container { perspective: 1200px; }
        .book-flip {
          position: relative;
          transform-origin: 35% 50%;
          transform-style: preserve-3d;
          transition: transform 0.5s ease;
        }
        .book-cover-hover:hover .book-flip { transform: rotateY(-35deg); }

        /* page thickness effect */
        .book-flip::after {
          content: '';
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

        /* Spiral binding like the original */
        .spiral-binding::before {
          content: '';
          position: absolute;
          top: 50%;
          height: 107%;
          width: 39px;
          left: -17px;
          z-index: 50;
          transform: translateY(-50%) scale(0.855);
          background-image: url('/images/Vector-Smart-Object.png');
          background-size: contain;
          background-repeat: no-repeat;
        }

        /* Top logo (text fallback) */
        .book-logo {
          position: absolute;
          top: 7%;
          left: 50%;
          transform: translateX(-50%);
          width: 70%;
          max-width: 210px;
          text-align: center;
          line-height: 1.05;
          letter-spacing: 0.08em;
          filter: drop-shadow(0 1px 1px rgba(0,0,0,0.35));
          color: #ffffff;
        }
        .book-logo .line1 { font-weight: 800; font-size: 16px; }
        .book-logo .line2 { font-weight: 800; font-size: 14px; margin-top: 2px; }

        /* Profile image frame (centered like the screenshot) */
        .profile-frame {
          position: absolute;
          top: 47%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 140px;
          height: 160px;
          border: 4px solid #fde68a; /* yellow-200 */
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 6px 16px rgba(0,0,0,0.35);
          z-index: 10;
        }

        /* Bottom caption */
        .bottom-caption {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          text-align: center;
          color: #ffffff;
          filter: drop-shadow(0 1px 1px rgba(0,0,0,0.35));
          letter-spacing: 0.15em;
        }
        .bottom-caption .small {
          text-transform: uppercase;
          font-weight: 700;
          font-size: 11px;
          opacity: 0.95;
        }
        .bottom-caption .name {
          margin-top: 6px;
          font-weight: 700;
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Responsive tweaks */
        @media (min-width: 640px) {
          .profile-frame { width: 150px; height: 172px; }
        }
        @media (min-width: 768px) {
          .profile-frame { width: 160px; height: 184px; }
        }
      `}</style>

      <div className="w-full max-w-[430px] mx-auto pt-3">
        <div className="book-cover-hover">
          <div className="book-flip-container">
            <div className="book-flip">
              <Link
                href={href || `/Diaries/${id}`}
                className="block w-full spiral-binding relative"
              >
                {/* fixed 3:4 cover like original */}
                <div className="relative w-full aspect-[3/4]">
                  <Image
                    src={coverImage}
                    alt="Book Cover"
                    fill
                    className="object-cover"
                    priority
                  />

                  {/* Top logo (text fallback) */}
                  <div className="book-logo">
                    <div className="line1">EXECUTIVES</div>
                    <div className="line2">DIARY</div>
                  </div>

                  {/* Center profile frame */}
                  <div className="profile-frame">
                    <Image
                      src={profileImage}
                      alt={`${authorName} profile`}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Bottom caption */}
                  <div className="bottom-caption">
                    <div className="small">FROM THE DIARY OF</div>
                    <div className="name">{authorName}</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DiaryBookFlip;
