"use client";

import React, { useEffect, useMemo, useState } from "react";
import BookFlipLong from "../../../components/BookFlipLong";
import BookFlip from "../../../components/BookFlip";
import ShareButtons from "../../../components/ShareButtons";
import { useSearchParams } from "next/navigation";
import { use } from "react";

export default function DiaryClosed({params}) {
  const { id } = use(params);
  const searchParams = useSearchParams();

  const showRecs = String(searchParams.get("showRecommendations") ?? "").toLowerCase() !== "false";


  const [executive, setExecutive] = useState(null);
  const [relevantDiaries, setRelevantDiaries] = useState([]);

  const API = (process.env.NEXT_PUBLIC_API_DOMAIN || "").replace(/\/$/, "");
  const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");

  const toAbsoluteUrl = (path) => (path?.startsWith("http") ? path : `${SITE}${path || ""}`);



  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        // Fetch all executives (adjust to your API if there’s a detail endpoint)
        const res = await fetch(`${API}/api/executives/`, { cache: "no-store" });
        const json = await res.json();

        if (!res.ok || !json?.data) throw new Error("Failed to load executives");

        // Find the target executive by route id
        const exe = json.data.find((e) => String(e.id) === String(id));
        if (exe && isMounted) {
          setExecutive({
            id: exe.id,
            coverImage:  "/images/cover-ed2.png",
            profileImage: exe.picture || "/images/demoBookFlip.jpg",
            authorName: exe.first_name || exe.diary_title || "Unknown",
            industry: exe.industry || "Unknown",
            jobTitle: exe.job_title || "Unknown",
            first_name: exe.user_first_name || 'Unknown',
            last_name: exe.user_last_name || 'Unknown',
            // public diary page slug (adjust if you have a different public route)
            href: `/executives/${exe.diary_title?.replace(/\s+/g, "-").toLowerCase() || exe.id}`,
            about: exe.about || "",
          });
        }

        // “You may be interested in” (exclude current, take 4)
        const more = json.data
          .filter((e) => String(e.id) !== String(id))
          .slice(0, 4)
          .map((e) => ({
            id: e.id,
            coverImage:  "/images/cover-ed2.png",
            profileImage: e.picture || "/images/demoBookFlip.jpg",
            authorName: e.first_name || e.diary_title || "Unknown",
            industry: e.industry || "Unknown",
            jobTitle: e.job_title || "Unknown",
            first_name: e.user_first_name || 'Unknown',
            last_name: e.user_last_name || 'Unknown',
            href: `/executives/${e.diary_title?.replace(/\s+/g, "-").toLowerCase() || e.id}`,
          }));

        if (isMounted) setRelevantDiaries(more);
      } catch (err) {
        console.error(err);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [API, id]);

  const shareUrl = useMemo(() => (executive ? toAbsoluteUrl(executive.href) : ""), [executive]);

  if (!executive) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <section className="w-full">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-16">
          {/* LEFT: Book */}
          <div className="flex flex-col items-center md:items-start">
            <BookFlipLong
              coverImage={executive.coverImage}
              profileImage={executive.profileImage}
              authorName={executive.authorName}
              firstName={executive.first_name}
              lastName={executive.last_name}
              industry={executive.industry}
              jobTitle={executive.jobTitle}
              href={`Diary/${executive.id}`}
              size="large"
            />

            {/* Share bar (exactly like screenshots) */}
            <div className="mt-0 md:pl-26 !mb-0">
              <ShareButtons
                url={shareUrl}
                title={`From the diary of ${executive.authorName}`}
                description={executive.about?.slice(0, 180)}

              />
            </div>
          </div>

          {/* RIGHT: Text */}
          <div className="pt-18">
            <p className="inline-block rounded-sm bg-[#1e1c4d] px-3 py-1.5 text-xs sm:text-sm font-semibold text-white">
              {executive.industry}
            </p>

            <h3 className="mt-4 sm:mt-4 text-2xl sm:text-4xl font-semibold tracking-wide text-[#54557a] font-muli">
              From the Diary Of
            </h3>

            <h1 className="mt-1 text-4xl sm:text-3xl lg:text-5xl  font-bold uppercase leading-tight font-cinzel text-[#1e1c4d]">
             {`${executive?.first_name}  ${executive?.last_name}` || authorName}
            </h1>

            <p className="mt-4 sm:mt-4 text-[14px] sm:text-[15px] leading-7 text-black">
              {executive.about}
            </p>

            {/* <a
              href={executive.href}
              className="mt-4 inline-flex items-center rounded-md bg-[#25c08a] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25c08a]"
            >
              Read More
            </a> */}

            <hr className="mt-8 sm:mt-10 border-t border-gray-200" />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center mb-14">
      </div>
      {showRecs && (
        <>
          <h2 className="text-[42px] text-center tracking-wide font-normal font-cinzel mt-14">
            <span className="text-[#46413e]">Diaries You May Be Interested In</span>
          </h2>
          <div className="flex flex-wrap items-center justify-center mb-14">
            {relevantDiaries.map((exe) => (
              <BookFlip
                key={exe.id}
                {...exe}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
