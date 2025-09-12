"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import DiaryUpdateForm from "../../../components/DiaryUpdateForm";
import BookFlip from "../../../components/BookFlip";

export default function DiaryCover() {
  const { id } = useParams(); // /ClientDashboard/[id]/DiaryCover
  const API_BASE = (process.env.NEXT_PUBLIC_API_DOMAIN || "").replace(/\/$/, "");
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const [exec, setExec] = useState(null);   // server copy
  const [draft, setDraft] = useState(null); // live editing state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const toAbs = useCallback(
    (path) => (!path ? "" : /^https?:\/\//i.test(path) ? path : `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`),
    [API_BASE]
  );

  // normalize server -> form shape you care about for diary cover
  const toForm = useCallback((e) => ({
    diary_title: e?.diary_title ?? `${e?.user_first_name ?? ""} ${e?.user_last_name ?? ""}`.trim(),
    about: e?.about ?? "",
    // local-only preview for cover image
    _cover_preview: e?.diary_cover ? toAbs(e.diary_cover) : "",
  }), [toAbs]);

  // fetch executive
  useEffect(() => {
    const run = async () => {
      if (!id || !token) return;
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/api/executives/${id}/`, {
          headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || "Failed to fetch executive");
        const payload = json?.data ?? json;
        setExec(payload);
        setDraft(toForm(payload)); // seed
      } catch (e) {
        setError(e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [API_BASE, id, token, toForm]);

  // live preview object for BookFlip — prefer draft values
  const preview = useMemo(() => {
    const e = exec || {};
    return {
      // name for title line on the left preview page
      title: draft?.diary_title || e.diary_title || `${e.user_first_name ?? ""} ${e.user_last_name ?? ""}`.trim(),
      // cover image (use local preview first)
      coverUrl: draft?._cover_preview || (e.diary_cover ? toAbs(e.diary_cover) : ""),
      // optional blurb/description
      about: draft?.about ?? e.about ?? "",
      // you can pass other fields BookFlip uses here
    };
  }, [exec, draft, toAbs]);

  return (
    <div
      className="
        relative mx-auto my-4 md:my-10
        w-[95vw] max-w-[1700px]
        h-auto md:h-[640px] min-h-[600px]
        border-[#1e1c4d] border-[12px] md:border-[19px] border-x-[20px] md:border-x-[30px]
        rounded-[8px] md:rounded-[10px]
        shadow-[0_4px_16px_rgba(0,0,0,0.15)] md:shadow-[0_8px_24px_rgba(0,0,0,0.15)]
      "
    >
      <div className="bg-white relative z-10 h-full">
        <span
          className="hidden md:block pointer-events-none absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[4px] bg-[#2d3a6b]"
          aria-hidden
        />

        {error && (
          <div className="m-4 md:mx-10 md:mt-6 rounded bg-red-50 text-red-700 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <div className="grid h-full grid-cols-1 md:grid-cols-2">
          {/* Left: Preview */}
          <div className="flex items-center flex-col justify-center px-4 md:px-10 py-6 md:py-10 h-full overflow-y-auto custom-scrollbar">
            <h2 className="text-xl md:text-3xl mt-10 font-bold text-center text-gray-800 font-cinzel">
              From the diary of {preview.title || "—"}
            </h2>
            <BookFlip
              id={id}
              coverImage={"/images/cover-ed2.png"}
              profileImage={exec?.picture || "/images/avatar-fallback.png"}
              authorName={`${exec?.user_first_name ?? ""} ${exec?.user_last_name ?? ""}`}
              diaryTitle={draft?.diary_title || exec?.diary_title}
              jobTitle={exec?.job_title || ""}
              industry={exec?.industry || ""}
            />
          </div>

          {/* Right: Form */}
          <div className="flex items-start px-4 md:px-10 py-6 md:py-10 h-full overflow-y-auto">
            <DiaryUpdateForm
              key={id}
              loading={loading}
              // pass normalized draft as initialValues
              initialValues={draft}
              // let the form push live changes for instant preview
              onChange={(nextValues, meta) => {
                setDraft((prev) => ({
                  ...prev,
                  ...nextValues,
                  _cover_preview: meta?.coverPreviewUrl ?? prev?._cover_preview ?? "",
                }));
              }}
              // submit handler: supports optional cover file upload
              onSubmit={async (values, { coverFile }) => {
                try {
                  let res, data;
                  if (coverFile) {
                    const fd = new FormData();
                    // fields you want to patch
                    fd.append("diary_title", values.diary_title ?? "");
                    fd.append("about", values.about ?? "");
                    fd.append("diary_cover", coverFile); // backend field name
                    res = await fetch(`${API_BASE}/api/executives/${id}/`, {
                      method: "PATCH",
                      headers: { Authorization: `Token ${token}` },
                      body: fd,
                    });
                  } else {
                    const body = {
                      diary_title: values.diary_title ?? "",
                      about: values.about ?? "",
                    };
                    res = await fetch(`${API_BASE}/api/executives/${id}/`, {
                      method: "PATCH",
                      headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
                      body: JSON.stringify(body),
                    });
                  }
                  data = await res.json();
                  if (!res.ok) throw new Error(data?.message || "Failed to update");
                  const payload = data?.data ?? data;
                  setExec(payload);
                  setDraft(toForm(payload)); // reset draft from server
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
