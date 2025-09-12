"use client";
import React, { useEffect, useState } from "react";

export default function UpdateSocialForm({ executiveId, API_BASE, token }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchExec = async () => {
    if (!executiveId || !token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/executives/${executiveId}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to load executive");
      setData(json?.data ?? json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExec(); }, [executiveId, token, API_BASE]);

  if (loading) return <div className="text-gray-600">Loading…</div>;
  if (!data) return <div className="text-gray-600">No data.</div>;

  const account = {
    username: data?.diary_title || `${data?.user_first_name ?? ""} ${data?.user_last_name ?? ""}`.trim(),
    email: data?.user_email || "",
  };

  const social = {
    website: data?.website || "",
    linkedin: data?.linkedin || "",
    twitter: data?.twitter || "",
    facebook: data?.facebook || "",
    instagram: data?.instagram || "",
    youtube: data?.youtube || "",
  };

  return (
    <div className="flex-1 max-w-3xl mx-auto">
      {/* ACCOUNT INFORMATION */}
      <h2 className="text-center text-xl md:text-2xl font-bold font-cinzel tracking-wide uppercase text-gray-800 mb-6">
        Account Information
      </h2>

      <section className="w-full">
        <Row label="UserName:" value={account.username} />
        <Row label="Email:" value={account.email} />
      </section>

      {/* SOCIALMEDIA INFORMATION */}
      <h2 className="text-center mt-8 text-xl md:text-2xl font-bold font-cinzel tracking-wide uppercase text-gray-800 mb-6">
        Socialmedia Information
      </h2>

      <section className="w-full">
        <Row label="Website:" value={social.website} />
        <Row label="Linkedin:" value={social.linkedin} />
        <Row label="Twitter:" value={social.twitter} />
        <Row label="Facebook:" value={social.facebook} />
        <Row label="Instagram:" value={social.instagram} />
        <Row label="Youtube:" value={social.youtube} />
      </section>
    </div>
  );
}

/** Single line exactly like the image: label on left, value on right, thin divider */
function Row({ label, value }) {
  return (
    <div className="grid grid-cols-[110px_1fr] md:grid-cols-[140px_1fr] gap-4 items-center border-b border-gray-300 py-4 px-3">
      <div className="text-gray-800 font-semibold">{label}</div>
      <div className="text-gray-800 break-words">{value || "—"}</div>
    </div>
  );
}
