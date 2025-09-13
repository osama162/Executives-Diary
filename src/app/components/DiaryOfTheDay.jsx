"use client";

import { useState, useEffect } from "react";
import CarouselPanel from "./CarouselPanel";
import Image from "next/image";

const DiaryOfTheDay = () => {
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [founderEntries, setFounderEntries] = useState([]);
  const [diaryIndex, setDiaryIndex] = useState(0);
  const [founderIndex, setFounderIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      // Check if API domain is configured
      if (!process.env.NEXT_PUBLIC_API_DOMAIN) {
        console.warn(
          "NEXT_PUBLIC_API_DOMAIN is not configured for DiaryOfTheDay"
        );
        setError("API not configured");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const apiUrl = `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/executives/`;
        console.log(`DiaryOfTheDay fetching from: ${apiUrl}`);

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (response.ok) {
          const diaries = data.data.filter((entry) =>
            entry.labels.includes("diary_of_the_day")
          );
          const founders = data.data.filter((entry) =>
            entry.labels.includes("founder_of_the_day")
          );

          const diaryEntries = diaries.map((entry) => ({
            name: `${entry.user_first_name} ${entry.user_last_name}`,
            title: entry.job_title,
            industry: entry.industry,
            image: entry.picture,
            description: entry.about,
            url: `/Diaries/${entry.id}`,
          }));

          const founderEntries = founders.map((entry) => ({
            name: `${entry.user_first_name} ${entry.user_last_name}`,
            title: entry.job_title,
            industry: entry.industry,
            image: entry.picture,
            description: entry.about,
            url: `/Diaries/${entry.id}`,
          }));

          setDiaryEntries(diaryEntries);
          setFounderEntries(founderEntries);
        }
      } catch (error) {
        console.error("Error fetching DiaryOfTheDay data: ", error);
        setError(`Failed to load diary data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const nextDiary = () =>
    setDiaryIndex((prev) => (prev + 1) % diaryEntries.length);
  const prevDiary = () =>
    setDiaryIndex(
      (prev) => (prev - 1 + diaryEntries.length) % diaryEntries.length
    );
  const nextFounder = () =>
    setFounderIndex((prev) => (prev + 1) % founderEntries.length);
  const prevFounder = () =>
    setFounderIndex(
      (prev) => (prev - 1 + founderEntries.length) % founderEntries.length
    );

  return (
    <section className="mt-12 mb-5">
      <div className="max-w-6xl mx-auto px-4">
        <div
          className="
            bg-[#f1e8d6] 
            rounded-[10px] 
            border-y-[19px] border-x-[25px] border-[#1e1c4d] 
            overflow-visible relative
            min-h-[520px] 
            md:min-h-[560px]
          "
        >
          <div className="z-10 relative">
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e1c4d] mx-auto"></div>
                  <p className="mt-4 text-[#1e1c4d]">Loading diary data...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center text-red-600">
                  <p className="text-lg font-semibold">
                    Failed to load diary data
                  </p>
                  <p className="text-sm mt-2">{error}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2">
                {diaryEntries.length > 0 && (
                  <CarouselPanel
                    title="Diary of the Day"
                    entry={diaryEntries[diaryIndex]}
                    onPrev={prevDiary}
                    onNext={nextDiary}
                    isFirst={diaryIndex === 0}
                    isLast={diaryIndex === diaryEntries.length - 1}
                    titleClassName="text-lg md:text-xl font-semibold"
                  />
                )}
                {founderEntries.length > 0 && (
                  <CarouselPanel
                    title="Founder of the Day"
                    entry={founderEntries[founderIndex]}
                    onPrev={prevFounder}
                    onNext={nextFounder}
                    isFirst={founderIndex === 0}
                    isLast={founderIndex === founderEntries.length - 1}
                    titleClassName="text-lg md:text-xl font-semibold"
                  />
                )}
                {diaryEntries.length === 0 && founderEntries.length === 0 && (
                  <div className="col-span-2 flex items-center justify-center min-h-[400px]">
                    <p className="text-[#1e1c4d] text-center">
                      No diary entries available
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="absolute right-7">
            <Image
              src="/images/SHAPE.png"
              alt="ribbon"
              width={130}
              height={200}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiaryOfTheDay;
