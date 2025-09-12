"use client";

import { useState, useEffect } from "react";
import DiaryOfTheDay from "../components/DiaryOfTheDay";
import BookFlip from "../components/BookFlip";

export default function Home() {
  const [featuredExecutives, setFeaturedExecutives] = useState([]);
  const [trendingDiaries, setTrendingDiaries] = useState([]);
  const [popularDiaries, setPopularDiaries] = useState([]);

  const fetchExecutivesByLabel = async (label) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/executives/?labels=${label}&biography_status=active`
      );
      const data = await response.json();
      if (response.ok) {
        console.log(data.data)
        return data.data.map((entry) => ({
          id: entry.id,
          coverImage: "/images/cover-ed2.png",
          profileImage: entry.picture || "/images/demoBookFlip.jpg",
          authorName: entry.first_name || entry.diary_title || "Unknown",
          industry: entry.industry || "Unknown",
          jobTitle: entry.job_title || "Unknown",
          first_name:entry.user_first_name|| 'Unknown',
          last_name:entry.user_last_name|| 'Unknown',
          href: `/executives/${entry.diary_title?.replace(/\s+/g, "-").toLowerCase() || entry.id}`,
        }));
      } else {
        console.error("Error fetching executives for label:", label, data.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching executives for label:", label, error);
      return [];
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      const featured = await fetchExecutivesByLabel("featured");
      const trending = await fetchExecutivesByLabel("trending");
      const popular = await fetchExecutivesByLabel("popular");

      setFeaturedExecutives(featured);
      setTrendingDiaries(trending);
      setPopularDiaries(popular);
    };

    fetchAll();
  }, []);

  return (
    <div>
      <DiaryOfTheDay />

      <div className="max-w-7xl mx-auto my-[60px]">
        {/* FEATURED EXECUTIVES */}
        <h2 className="text-[42px] text-center tracking-wide font-normal font-cinzel">
          <span className="text-[#2d2d2d]">FEATURED</span>{" "}
          <span className="bg-[#1dd1a1] text-white px-2">EXECUTIVES</span>
        </h2>
        <div className="flex flex-wrap items-center justify-center">
          {featuredExecutives.map((executive) => (
            <BookFlip key={executive.id} {...executive} />
          ))}
        </div>

        {/* TRENDING DIARIES OF THE WEEK */}
        <h2 className="text-[42px] text-center tracking-wide font-normal font-cinzel mt-14">
          <span className="text-[#2d2d2d]">Trending Diaries Of the</span>{" "}
          <span className="bg-[#1dd1a1] text-white px-2">Week</span>
        </h2>
        <div className="flex flex-wrap items-center justify-center">
          {trendingDiaries.map((executive) => (
            <BookFlip key={executive.id} {...executive} />
          ))}
        </div>

        {/* POPULAR DIARIES */}
        <h2 className="text-[42px] text-center tracking-wide font-normal font-cinzel mt-14">
          <span className="text-[#2d2d2d]">Popular</span>{" "}
          <span className="bg-[#1dd1a1] text-white px-2">Diaries</span>
        </h2>
        <div className="flex flex-wrap items-center justify-center">
          {popularDiaries.map((executive) => (
            <BookFlip key={executive.id} {...executive} />
          ))}
        </div>
      </div>
    </div>
  );
}
