"use client";
import Image from "next/image";

const AVATAR_SVG = `
<svg xmlns='http://www.w3.org/2000/svg' width='144' height='144' viewBox='0 0 144 144'>
  <rect width='144' height='144' fill='#e5e7eb'/>
  <circle cx='72' cy='52' r='24' fill='#9ca3af'/>
  <rect x='24' y='92' width='96' height='28' rx='14' fill='#9ca3af'/>
</svg>`;
const STAMP_SVG = `
<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>
  <circle cx='48' cy='48' r='46' fill='white' stroke='#1e3a8a' stroke-width='4'/>
  <circle cx='48' cy='48' r='36' fill='#1e40af'/>
  <text x='48' y='55' text-anchor='middle' font-family='Arial, sans-serif' font-size='24' fill='white' font-weight='700'>ED</text>
</svg>`;

const DUMMY_PHOTO = `data:image/svg+xml;utf8,${encodeURIComponent(AVATAR_SVG)}`;
const DUMMY_STAMP = `data:image/svg+xml;utf8,${encodeURIComponent(STAMP_SVG)}`;

// Small helper: make relative api paths absolute when baseUrl is given
const absolutize = (url, baseUrl) => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url) || url.startsWith("data:") || url.startsWith("blob:")) return url;
  if (!baseUrl) return url;
  const base = baseUrl.replace(/\/$/, "");
  return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
};

export default function PreviewCard({
  executive = null,      // <-- pass the full executive object here
  baseUrl = "",          // optional: NEXT_PUBLIC_API_DOMAIN to absolutize picture path
  stamp = DUMMY_STAMP,
}) {
  // Map API -> UI
  const firstName = executive?.user_first_name || executive?.diary_title || "—";
  const lastName  = executive?.user_last_name || "";
  const jobTitle  = executive?.job_title || "—";
  const company   = executive?.company || "—";
  const industry  = executive?.industry || "—";
  const location  = [executive?.city, executive?.state, executive?.country].filter(Boolean).join(", ") || "—";
  const photo     = executive?.picture ? absolutize(executive.picture, baseUrl) : DUMMY_PHOTO;

  return (
    <div className="flex-1">
      <h2 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-4 md:mb-6 font-cinzel">
        PREVIEW CARD
      </h2>

      <div className="relative mx-auto w-full max-w-[720px] bg-[#3D74D9] text-white shadow-xl overflow-hidden min-h-[280px] md:min-h-[320px]">
        {/* Left content */}
        <div className="py-2 md:py-4 pr-24 md:pr-32">
          <h3 className="mt-4 md:mt-8 mb-0">
            <span className="inline-block bg-[#2F5EC6] px-3 md:px-4 py-1 md:py-2 shadow-[2px_4px_0_rgba(0,0,0,0.25)]">
              <span className="text-lg md:text-2xl lg:text-3xl leading-none tracking-wide">
                <span className="capitalize">{firstName}</span> <span className="capitalize">{lastName}</span>
              </span>
            </span>
          </h3>

          <div className="px-3 md:px-4 py-3 md:py-6">
            <div className="mt-2 md:mt-4 text-blue-100">
              <div className="text-base md:text-lg">{jobTitle}</div>
              <div className="text-sm md:text-base">{company}</div>
            </div>

            <div className="mt-4 md:mt-8 text-xs md:text-sm lg:text-base">
              <div className="grid grid-cols-[auto_1fr] gap-x-2 md:gap-x-3 gap-y-2 md:gap-y-3">
                <span className="text-blue-200">Industry:</span>
                <span className="text-white">{industry}</span>

                <span className="text-blue-200">Location:</span>
                <span className="text-white">{location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="absolute top-2 md:top-0 right-2 md:right-0 flex flex-col items-center justify-between py-3 md:py-6 px-2 md:px-4">
          <div className="h-20 w-24 md:h-28 md:w-32 lg:h-32 lg:w-36 bg-white/20 overflow-hidden ring-2 md:ring-4 ring-white/20 mb-2 md:mb-4">
            <Image
              src={photo}
              alt="Profile"
              width={128}
              height={128}
              className="h-full w-full object-cover"
            />
          </div>
          {/* <div className="flex justify-center">
            <Image
              src={stamp || DUMMY_STAMP}
              alt="Executive's Diary Verified"
              width={96}
              height={96}
              className="opacity-90 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
            />
          </div> */}
        </div>
      </div>
    </div>
  );
}
