// src/app/components/MainContent.jsx
"use client";
import { useEffect, useState } from "react";

export default function MainContent({ executiveId }) {
  const [exec, setExec] = useState(null);

  useEffect(() => {
    if (!executiveId) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/executives/${executiveId}/`, {
      headers: { Authorization: `Token ${token}` }
    })
      .then(r => r.json())
      .then(d => setExec(d?.data || d))
      .catch(() => setExec(null));
  }, [executiveId]);

  if (!executiveId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Welcome</h1>
        <p className="text-gray-600">Pick an executive to start editing.</p>
      </div>
    );
  }

  if (!exec) {
    return <div className="p-6 text-gray-600">Loading executive #{executiveId}…</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Welcome {exec.user_first_name} {exec.user_last_name}
      </h1>
    </div>
  );
}
