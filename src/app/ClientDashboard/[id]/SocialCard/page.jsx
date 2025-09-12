"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect, useMemo, useCallback } from "react";
import PreviewCard from "../../../components/PreviewCard";
import ProfileUpdateForm from "../../../components/ProfileUpdateForm";

const FALLBACK_AVATAR = "/images/avatar-fallback.png";

export default function SocialCard() {
  const { id } = useParams();
  const API_BASE = (process.env.NEXT_PUBLIC_API_DOMAIN || "").replace(/\/$/, "");
  const [exec, setExec] = useState(null);
  const [draft, setDraft] = useState(null);     // <-- live draft for form + preview
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const toAbs = useCallback(
    (path) => (!path ? "" : /^https?:\/\//i.test(path) ? path : `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`),
    [API_BASE]
  );

  // normalize API object -> form shape
  const toForm = (e) => ({
    first_name: e?.first_name ?? e?.user_first_name ?? "",
    last_name:  e?.last_name  ?? e?.user_last_name  ?? "",
    job_title:  e?.job_title  ?? "",
    company:    e?.company    ?? "",
    about:      e?.about      ?? "",
    country:    e?.country    ?? "",
    state:      e?.state      ?? "",
    city:       e?.city       ?? "",
    industry:   e?.industry   ?? "",
    website:    e?.website    ?? "",
    linkedin:   e?.linkedin   ?? "",
    twitter:    e?.twitter    ?? "",
    facebook:   e?.facebook   ?? "",
    instagram:  e?.instagram  ?? "",
    youtube:    e?.youtube    ?? "",
    // local-only preview field
    _picture_preview: e?.picture ? toAbs(e.picture) : "",
  });

  useEffect(() => {
    const fetchExec = async () => {
      if (!id || !token) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/executives/${id}/`, {
          headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || "Failed to fetch executive");
        const payload = json?.data ?? json;
        setExec(payload);
        setDraft(toForm(payload));     // <-- seed draft from server
      } catch (e) {
        setError(e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetchExec();
  }, [id, token, API_BASE]);

  // live preview prefers draft; falls back to exec
  const previewExec = useMemo(() => {
    const base = exec || {};
    return {
      ...base,
      user_first_name: draft?.first_name ?? base.user_first_name ?? base.first_name,
      user_last_name:  draft?.last_name  ?? base.user_last_name  ?? base.last_name,
      job_title:       draft?.job_title  ?? base.job_title,
      company:         draft?.company    ?? base.company,
      about:           draft?.about      ?? base.about,
      country:         draft?.country    ?? base.country,
      state:           draft?.state      ?? base.state,
      city:            draft?.city       ?? base.city,
      industry:        draft?.industry   ?? base.industry,
      website:         draft?.website    ?? base.website,
      linkedin:        draft?.linkedin   ?? base.linkedin,
      twitter:         draft?.twitter    ?? base.twitter,
      facebook:        draft?.facebook   ?? base.facebook,
      instagram:       draft?.instagram  ?? base.instagram,
      youtube:         draft?.youtube    ?? base.youtube,
      picture:         draft?._picture_preview || base.picture, // show local preview if present
    };
  }, [exec, draft]);

  return (
    <div className="relative mx-auto my-10 w-[95vw] max-w-[1700px] h-[640px] border-[#1e1c4d] border-[19px] border-x-[30px] rounded-[10px] shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
      <div className="bg-white p-4 md:p-10 relative z-10 h-full">
        {error && <div className="mb-3 bg-red-50 text-red-700 px-3 py-2 rounded">{error}</div>}

        <div className="flex flex-col md:flex-row gap-4 md:gap-8 h-full">
          {/* Left: Preview */}
          <div className="flex-1 overflow-auto">
            <PreviewCard executive={previewExec} baseUrl={process.env.NEXT_PUBLIC_API_DOMAIN} />
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px bg-[#2d3a6b]/80 mx-1" />

          {/* Right: Form */}
          <div className="flex-1 md:-mr-10 overflow-auto">
            <ProfileUpdateForm
              key={id}
              loading={loading}
              initialValues={draft}                                  // <-- controlled by page
              avatarUrl={draft?._picture_preview || (exec?.picture ? toAbs(exec.picture) : "")}
              onChange={(nextValues, meta) => {                      // <-- live sync from form
                setDraft((prev) => ({
                  ...prev,
                  ...nextValues,
                  _picture_preview: meta?.avatarPreviewUrl ?? prev?._picture_preview ?? "",
                }));
              }}
              onSubmit={async (values, { avatarFile }) => {          // save
                try {
                  let res, data;
                  if (avatarFile) {
                    const fd = new FormData();
                    Object.entries(values).forEach(([k, v]) => fd.append(k, v ?? ""));
                    fd.append("picture", avatarFile);
                    res = await fetch(`${API_BASE}/api/executives/${id}/`, {
                      method: "PATCH",
                      headers: { Authorization: `Token ${token}` },
                      body: fd,
                    });
                  } else {
                    res = await fetch(`${API_BASE}/api/executives/${id}/`, {
                      method: "PATCH",
                      headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
                      body: JSON.stringify(values),
                    });
                  }
                  data = await res.json();
                  if (!res.ok) throw new Error(data?.message || "Failed to update");
                  const payload = data?.data ?? data;
                  setExec(payload);
                  setDraft(toForm(payload));                         // refresh draft from server
                } catch (e) {
                  alert(`Update failed: ${e.message}`);
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="absolute -bottom-13 right-7 z-0">
        <Image src="/images/SHAPE.png" alt="ribbon" height={120} width={120} priority />
      </div>
    </div>
  );
}
