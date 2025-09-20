"use client";

import { useState, useEffect } from "react";
import DiaryOfTheDay from "../components/DiaryOfTheDay";
import BookFlip from "../components/BookFlip";

export default function Home() {
    const [featuredExecutives, setFeaturedExecutives] = useState([]);
    const [trendingDiaries, setTrendingDiaries] = useState([]);
    const [popularDiaries, setPopularDiaries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log("API Domain:", process.env.NEXT_PUBLIC_API_DOMAIN);
    const fetchExecutivesByLabel = async (label) => {
        // Check if API domain is configured
        if (!process.env.NEXT_PUBLIC_API_DOMAIN) {
            console.warn(
                "NEXT_PUBLIC_API_DOMAIN is not configured. Please set it in your .env.local file"
            );
            return [];
        }

        try {
            const apiUrl = `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/executives/?labels=${label}&biography_status=active`;
            console.log(`Fetching from: ${apiUrl}`);

            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`Successfully fetched ${label} executives:`, data.data);

            return data.data.map((entry: any) => ({
                id: entry.id,
                coverImage: "/images/cover-ed2.png",
                profileImage: entry.picture || "/images/demoBookFlip.jpg",
                authorName: entry.first_name || entry.diary_title || "Unknown",
                industry: entry.industry || "Unknown",
                jobTitle: entry.job_title || "Unknown",
                first_name: entry.user_first_name || "Unknown",
                last_name: entry.user_last_name || "Unknown",
                href: `/executives/${entry.diary_title?.replace(/\s+/g, "-").toLowerCase() || entry.id
                    }`,
            }));
        } catch (error) {
            console.error(`Error fetching executives for label "${label}":`, error);
            setError(`Failed to load ${label} executives: ${error.message}`);
            return [];
        }
    };

    useEffect(() => {
        const fetchAll = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const featured = await fetchExecutivesByLabel("featured");
                const trending = await fetchExecutivesByLabel("trending");
                const popular = await fetchExecutivesByLabel("popular");

                setFeaturedExecutives(featured);
                setTrendingDiaries(trending);
                setPopularDiaries(popular);
            } catch (error) {
                console.error("Error in fetchAll:", error);
                setError("Failed to load executives data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAll();
    }, []);

    // Show error message if API is not configured
    if (error && !process.env.NEXT_PUBLIC_API_DOMAIN) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md">
                    <h2 className="text-xl font-semibold text-yellow-800 mb-4">
                        API Configuration Required{" "}
                    </h2>{" "}
                    <p className="text-yellow-700 mb-4">
                        Please set up your API domain in the{" "}
                        <code className="bg-yellow-100 px-2 py-1 rounded">
                            {" "}
                            .env.local{" "}
                        </code>{" "}
                        file.{" "}
                    </p>{" "}
                    <p className="text-sm text-yellow-600">
                        Add: <code> NEXT_PUBLIC_API_DOMAIN = your - api - url </code>{" "}
                    </p>{" "}
                </div>{" "}
            </div>
        );
    }

    return (
        <div>
            <DiaryOfTheDay />
            <div className="max-w-7xl mx-auto  xs:!mt-[48px] md:my-16 lg:my-[60px] px-4 sm:px-6 lg:px-8">
                {" "}
                {/* FEATURED EXECUTIVES */}{" "}
                <h2 className="text-2xl  xs:!mt-[75px] md:mt-0 sm:text-3xl md:text-4xl lg:text-[42px] text-center tracking-wide font-normal font-cinzel px-4">
                    <span className="text-[#2d2d2d]"> FEATURED </span>{" "}
                    <span className="bg-[#1dd1a1] text-white px-2"> EXECUTIVES </span>{" "}
                </h2>{" "}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 items-start justify-items-center">
                    {" "}
                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1dd1a1] mx-auto">
                                {" "}
                            </div>{" "}
                            <p className="mt-4 text-gray-600">
                                Loading featured executives...{" "}
                            </p>{" "}
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-600">
                            <p> Failed to load featured executives </p>{" "}
                            <p className="text-sm mt-2"> {error} </p>{" "}
                        </div>
                    ) : featuredExecutives.length > 0 ? (
                        featuredExecutives.map((executive) => (
                            <BookFlip key={executive.id} {...executive} />
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p> No featured executives available </p>{" "}
                        </div>
                    )}{" "}
                </div>{" "}
                {/* TRENDING DIARIES OF THE WEEK */}{" "}
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] text-center tracking-wide font-normal font-cinzel mt-8 sm:mt-12 md:mt-14 px-4">
                    <span className="text-[#2d2d2d]"> Trending Diaries Of the </span>{" "}
                    <span className="bg-[#1dd1a1] text-white px-2"> Week </span>{" "}
                </h2>{" "}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 items-start justify-items-center">
                    {" "}
                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1dd1a1] mx-auto">
                                {" "}
                            </div>{" "}
                            <p className="mt-4 text-gray-600">
                                {" "}
                                Loading trending diaries...{" "}
                            </p>{" "}
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-600">
                            <p> Failed to load trending diaries </p>{" "}
                            <p className="text-sm mt-2"> {error} </p>{" "}
                        </div>
                    ) : trendingDiaries.length > 0 ? (
                        trendingDiaries.map((executive) => (
                            <BookFlip key={executive.id} {...executive} />
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p> No trending diaries available </p>{" "}
                        </div>
                    )}{" "}
                </div>{" "}
                {/* POPULAR DIARIES */}{" "}
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] text-center tracking-wide font-normal font-cinzel mt-8 sm:mt-12 md:mt-14 px-4">
                    <span className="text-[#2d2d2d]"> Popular </span>{" "}
                    <span className="bg-[#1dd1a1] text-white px-2"> Diaries </span>{" "}
                </h2>{" "}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 items-start justify-items-center">
                    {" "}
                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1dd1a1] mx-auto">
                                {" "}
                            </div>{" "}
                            <p className="mt-4 text-gray-600"> Loading popular diaries... </p>{" "}
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-600">
                            <p> Failed to load popular diaries </p>{" "}
                            <p className="text-sm mt-2"> {error} </p>{" "}
                        </div>
                    ) : popularDiaries.length > 0 ? (
                        popularDiaries.map((executive) => (
                            <BookFlip key={executive.id} {...executive} />
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p> No popular diaries available </p>{" "}
                        </div>
                    )}{" "}
                </div>{" "}
            </div>{" "}
        </div>
    );
}
