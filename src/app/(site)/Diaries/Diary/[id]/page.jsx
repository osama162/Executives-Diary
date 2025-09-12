'use client';

import { useEffect, useState } from 'react';
import DiaryBook from '../../../../components/DiaryBook';
import { useParams } from 'next/navigation';

export default function DiaryDemoPage() {
  const params = useParams();
  const { id } = params || { id: 18 }; // fallback to 18 for demo

  const [executive, setExecutive] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [socialPosts, setSocialPosts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_DOMAIN || 'http://127.0.0.1:8000';

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
        console.error('Error loading diary data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [API_BASE, id]);

  if (loading) {
    return <p className="text-center mt-10">Loading Diary...</p>;
  }

  if (!executive) {
    return <p className="text-center mt-10 text-red-600">Executive not found.</p>;
  }

  return (
    <DiaryBook
      executive={executive}
      chapters={chapters}
      socialPosts={socialPosts}
      recommendations={recommendations}
    />
  );
}
