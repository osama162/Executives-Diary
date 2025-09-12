"use client";
import React from "react";
import Link from "next/link";

const EntryCard = ({ entry }) => (
  <div className="w-full max-w-[437px] min-h-[200px] sm:min-h-[250px] bg-[#f1e8d6] -mt-4 sm:-mt-6 px-3 sm:px-4 pb-1 sm:pb-[6px] relative">
    {/* Top Section: Image + Text */}
    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
      {/* Image Section */}
      <div className="w-full sm:w-[40%]">
        <Link href={entry.url} className="block w-full h-[40vw] max-h-[205px] sm:h-[15vw]">
          <img
            src={entry.image || '/images/nauman.jpeg'}
            alt={entry.name}
            className="w-full h-full object-cover object-bottom border-[3px] border-white rounded-md"
          />
        </Link>
      </div>

      {/* Text Section */}
      <div className="w-full sm:w-[60%] sm:pl-4 text-center sm:text-left">
        {/* Industry tag (external stays as <a>) */}
        <div className="mb-6 sm:mt-2">
          <p
            className="inline-block bg-[#f5df70] text-black px-3 sm:px-[20px] py-2 sm:py-[12px] text-xs sm:text-[13px] font-semibold rounded-[5px] leading-none hover:bg-[#f2d94e] transition-colors"
          >
            {entry.industry}
          </p>
        </div>

        {/* From the Diary of */}
        <div className="mb-2 sm:mt-[12px] sm:mb-[6px]">
          <Link
            href={entry.url}
            className="text-sm sm:text-[18px] font-semibold text-[#212529] opacity-60 leading-none hover:opacity-100 transition-opacity"
          >
            From the Diary of
          </Link>
        </div>

        {/* Executive Name */}
        <div className="exe-name pt-[10px]">
          <Link className="text-xl font-cinzel sm:text-2xl lg:text-3xl xl:text-[34px] font-medium leading-tight sm:leading-[1.2] text-[#424242] tracking-wide sm:tracking-[0.1em] uppercase"
            href={entry.url}>
              {entry.name}
            </Link>
          {/* </h2> */}
        </div>
      </div>
    </div>

    {/* Bottom Section */}
    <div className="mt-4 sm:mt-6 text-xs sm:text-[1rem] text-[#2a241c] text-center sm:text-left">
      <p className="mb-2 leading-relaxed font-medium">
        <strong>{entry.title}</strong>
      </p>
      <p className="mb-2 leading-relaxed font-normal text-[1rem] line-clamp-2">
        {entry.description}
      </p>

      <Link
        href={entry.url}
        className="text-base font-bold  text-[#1e1c4d] hover:text-[#1e1b45] border-b-2 transition-colors inline-block mt-1"
      >
        Read More
      </Link>
    </div>
  </div>
);

export default EntryCard;
