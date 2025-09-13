"use client";

import { useEffect, useState } from "react";
import DiaryBook from "../../../../components/DiaryBook";
import { useParams } from "next/navigation";
import Link from "next/link";
import NavigationButtons from "../../../../components/NavigationButtons";

export default function DiaryDemoPage() {
  const params = useParams();
  const { id } = params || { id: 18 }; // fallback to 18 for demo

  const [executive, setExecutive] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [socialPosts, setSocialPosts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_DOMAIN || "http://127.0.0.1:8000";

  useEffect(() => {
    async function fetchAll() {
      try {
        setLoading(true);

        // fetch executive
        const exeRes = await fetch(`${API_BASE}/api/executives/${id}/`);
        const exeJson = await exeRes.json();
        if (exeRes.ok && exeJson?.data) {
          setExecutive(exeJson.data);
        }

        // fetch chapters
        const chapRes = await fetch(
          `${API_BASE}/api/executives/executive-chapters/?executive_id=${id}`
        );
        const chapJson = await chapRes.json();
        if (chapRes.ok && Array.isArray(chapJson?.data)) {
          setChapters(chapJson.data);
        }

        // fetch social posts
        const socialRes = await fetch(
          `${API_BASE}/api/executives/executive-social-posts/?executive_id=${id}`
        );
        const socialJson = await socialRes.json();
        if (socialRes.ok && Array.isArray(socialJson?.data)) {
          setSocialPosts(socialJson.data);
        }

        // fetch recommendations
        const recRes = await fetch(
          `${API_BASE}/api/executives/executive-recommendations/?executive_id=${id}`
        );
        const recJson = await recRes.json();
        if (recRes.ok && Array.isArray(recJson?.data)) {
          setRecommendations(recJson.data);
        }
      } catch (err) {
        console.error("Error loading diary data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [API_BASE, id]);
  // Navigation buttons component

  if (loading) {
    return (
      <div className="flex flex-col items-center mt-10">
        {/* Skeleton for DiaryBook cover */}
        <div className="w-[320px] h-[420px] bg-gray-200 animate-pulse rounded-lg mb-6" />
        {/* Skeleton for title */}
        <div className="w-2/3 h-8 bg-gray-200 animate-pulse rounded mb-4" />
        {/* Skeleton for author */}
        <div className="w-1/3 h-6 bg-gray-200 animate-pulse rounded mb-8" />
        {/* Skeleton for chapters */}
        <div className="w-full max-w-2xl space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-5 bg-gray-200 animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!executive) {
    return (
      <p className="text-center mt-10 text-red-600">Executive not found.</p>
    );
  }

  return (
    <>
      <NavigationButtons />
      <DiaryBook
        executive={executive}
        chapters={chapters}
        socialPosts={socialPosts}
        recommendations={recommendations}
      />
    </>
  );
}
