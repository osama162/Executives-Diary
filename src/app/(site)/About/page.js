import Image from "next/image";
import React from "react";

const AboutPage = () => {
  return (
    <div
      className="
        relative 
        mx-4 sm:mx-6 md:mx-10 lg:mx-20 xl:mx-30 
        my-8 sm:my-12 md:my-16 lg:my-22  
        border-[#1e1c4d] border-[19px] border-x-[30px] 
        rounded-[10px]
      "
    >
      {/* White content box */}
      <div className="bg-white p-10 relative z-10">
        {/* Flex Layout */}
        <div className="flex flex-col md:flex-row md:items-stretch gap-8">
          {/* LEFT: YouTube */}
          <div className="flex-1">
            <h2 className="mb-4 sm:text-xl font-semibold text-black">
              Executives Diary Overview
            </h2>
            <div className="aspect-video w-full overflow-hidden rounded-md border border-slate-200">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/cuTC8wNGQy0"
                title="Executives Diary Overview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>

          {/* Divider */}
          {/* Horizontal on mobile */}
          <div className="block md:hidden">
            <span className="my-4 block h-px w-full bg-[#1e1c4d]" />
          </div>
          {/* Vertical on desktop */}
          <div className="hidden md:flex md:self-stretch">
            <span className="mx-2 w-1 bg-[#1e1c4d]" />
          </div>

          {/* RIGHT: Text (scrollable) */}
          <div
            className="
              flex-1 text-slate-800 text-base leading-7
              overflow-y-auto rounded-md custom-scrollbar max-h-[450px]
            "
          >
            <p className="mb-4">
              Welcome to Executives Diary! Here, business leaders, authors,
              Ph.D. scholars, consultants, and founders converge to enrich each
              other’s lives through shared wisdom and experiences. Our journey
              began uniquely when our founder, Muhammad Nauman, sought a venue
              to share his story while developing his personal website. His
              first interview, sourced through a freelance platform, ignited the
              spark for what would become a beacon for executive wisdom
              worldwide.
            </p>
            <p className="mb-4">
              Since its inception in 2018, Executives Diary has overcome
              numerous challenges to become a thriving global community. Today,
              it stands as a testament to the power of shared knowledge, with
              members from diverse industries finding value and inspiration in
              our collective stories.
            </p>
            <p className="mb-2">
              <strong>Our Mission:</strong> Providing a Digital Ledger for
              Seasoned Professionals and Leaders to Connect, Learn, and Inspire.
            </p>
            <p className="mb-2">
              <strong>Our Vision:</strong> Preserving Human History and Wisdom
              for Future Generations to Learn and Be Inspired.
            </p>
            <p className="mb-4">
              At the heart of Executives Diary are our core values: empowerment,
              diversity, authenticity, and lifelong learning. Our dedicated team
              is committed to fostering an inclusive environment where every
              executive’s story can be heard and can inspire tomorrow’s leaders.
            </p>
            <p>
              Join us as we continue to inspire and educate, one story at a
              time. Whether you’re looking to expand your network, share your
              journey, or inspire others with your achievements, Executives
              Diary is your platform. Explore our community and see how you can
              make a difference.
            </p>
          </div>
        </div>
      </div>

      {/* Ribbon between border & white box */}
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
  );
};

export default AboutPage;
