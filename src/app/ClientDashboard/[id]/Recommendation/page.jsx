// app/ClientDashboard/Recommendations/page.jsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useParams } from "next/navigation";
import { IoMdArrowDropright, IoMdArrowDropleft } from "react-icons/io";

// Disable SSR for react-pageflip
const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false });

// ---- Config for image upload ----
const MAX_IMG_MB = 5;
const ACCEPTED_IMG = ["image/png", "image/jpeg", "image/webp"];
const DEFAULT_AVATAR = "https://i.pravatar.cc/120?img=12"; // fallback dummy image

// Convert a File to a data URL so it survives page reloads and object URL revokes
const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function RecommendationsBook() {
  const bookRef = useRef(null);
  const [recs, setRecs] = useState([]);
  const params = useParams();
  const { id } = params;
  const API_BASE = process.env.NEXT_PUBLIC_API_DOMAIN;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const getRecommendations = useCallback(async () => {
    try {
      if (!API_BASE) throw new Error("API_BASE is empty; set NEXT_PUBLIC_API_DOMAIN");
      if (!token) {
        console.warn("No auth token yet; skip fetching");
        return;
      }

      const qs = new URLSearchParams({ executive_id: String(id) });
      const url = `${API_BASE}/api/executives/executive-recommendations/?${qs.toString()}`;
      const res = await fetch(url, {
        headers: { Authorization: `Token ${token}` },
        cache: "no-store",
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
      }

      const data = await res.json();

      // Normalize shape (ensure 'linkedin' and 'image' exist)
      const normalized = (data?.data ?? []).map((r) => ({
        ...r,
        linkedin: r.linkedin_url ?? r.linkedin ?? "",
        image: r.image ?? r.avatar ?? "", // support either key
      }));
      setRecs(normalized);
    } catch (err) {
      console.error("getRecommendations failed:", err);
      setRecs([]); // fail safe
    }
  }, [API_BASE, token, id]);

  useEffect(() => {
    getRecommendations();
  }, [getRecommendations]);

  // Render FlipBook only on client
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [selectedId, setSelectedId] = useState(null);

  // ===== Add modal =====
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newLinkedin, setNewLinkedin] = useState("");
  const [newAvatarDataUrl, setNewAvatarDataUrl] = useState("");
  const [newAvatarFile, setNewAvatarFile] = useState(null);

  // editor-local image state preview (not shared across editors)
  const [editorAvatarDataUrl, setEditorAvatarDataUrl] = useState("");

  const recIndex = useCallback((rid) => recs.findIndex((r) => r.id === rid), [recs]);
  const leftPageForIdx = (idx) => idx * 2;

  const goToPage = useCallback((pageNumber) => {
    try {
      bookRef.current?.pageFlip()?.flip(pageNumber);
    } catch {}
  }, []);

  const refreshBook = useCallback(() => {
    requestAnimationFrame(() => {
      try {
        bookRef.current?.pageFlip()?.updateFromHtml();
      } catch {}
    });
  }, []);

  const saveRec = async (rid, patch, imageFile = null) => {
    try {
      // 1) Optimistic UI for text fields + preview image
      setRecs((prev) =>
        prev.map((r) =>
          r.id === rid
            ? {
                ...r,
                name: patch.name ?? r.name,
                linkedin: patch.linkedin ?? r.linkedin,
                content: patch.content ?? r.content,
                image: patch.image ?? r.image, // may be a dataURL preview
              }
            : r
        )
      );
      refreshBook();

      // 2) Build request
      let res;
      if (imageFile) {
        // PATCH with multipart/form-data
        const fd = new FormData();
        if (patch.name != null) fd.append("name", patch.name);
        if (patch.linkedin != null) fd.append("linkedin_url", patch.linkedin);
        if (patch.content != null) fd.append("content", patch.content);
        fd.append("executive", String(id || ""));
        fd.append("image", imageFile, imageFile.name); // <-- send the actual file

        res = await fetch(`${API_BASE}/api/executives/executive-recommendations/${rid}/`, {
          method: "PATCH",
          headers: { Authorization: `Token ${token}` }, // don't set Content-Type
          body: fd,
        });
      } else {
        // text-only JSON patch
        const body = {
          ...(patch.name != null ? { name: patch.name } : {}),
          ...(patch.linkedin != null ? { linkedin_url: patch.linkedin } : {}),
          ...(patch.content != null ? { content: patch.content } : {}),
          executive: String(id || ""),
        };

        res = await fetch(`${API_BASE}/api/executives/executive-recommendations/${rid}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(body),
        });
      }

      if (!res.ok) throw new Error(`Patch failed ${res.status}`);

      // 3) Sync with server
      const updated = await res.json();
      const u = updated?.data ?? updated ?? null;
      if (u) {
        const normalized = {
          ...u,
          linkedin: u.linkedin_url ?? u.linkedin ?? "",
          image: u.image ?? u.avatar ?? "",
        };
        setRecs((prev) => prev.map((r) => (r.id === rid ? normalized : r)));
      }

      // optional: keep editor visible
      // refreshBook();
      window.location.reload()
    } catch (err) {
      console.error("saveRec error", err);
      alert("Failed to save changes.");
    }
  };

  // ---- Create (POST) with optional image
  const addRec = async (e) => {
    e?.preventDefault?.();

    try {
      const fd = new FormData();  
      fd.append("name", newName || "");
      fd.append("content", newContent || "");
      fd.append("linkedin_url", newLinkedin || "");
      fd.append("executive", String(id || ""));
      if (newAvatarFile) fd.append("image", newAvatarFile, newAvatarFile.name);

      const res = await fetch(`${API_BASE}/api/executives/executive-recommendations/`, {
        method: "POST",
        headers: { Authorization: `Token ${token}` }, // don't set Content-Type
        body: fd,
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        console.error("Create failed", res.status, t);
        alert("Failed to create recommendation.");
        return null;
      }

      const created = await res.json();
      const c = created?.data ?? created ?? null;
      if (c) {
        const normalized = {
          ...c,
          linkedin: c.linkedin_url ?? c.linkedin ?? "",
          image: c.image ?? c.avatar ?? "",
        };
        setRecs((prev) => [...prev, normalized]);
      }

      setShowModal(false);
      setNewName("");
      setNewContent("");
      setNewLinkedin("");
      setNewAvatarDataUrl("");
      setNewAvatarFile(null);
      window.location.reload()

      // Jump to new page
      requestAnimationFrame(() => {
        refreshBook();
        const idx = recs.length; // new one is last
        goToPage(leftPageForIdx(idx));
      });
    } catch (err) {
      console.error("addRec error", err);
      alert("Failed to create recommendation.");
    }
  };

  const deleteRec = async (rid) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/executives/executive-recommendations/${rid}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Token ${token}` },
        }
      );
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      setRecs((prev) => prev.filter((r) => r.id !== rid));
      refreshBook();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // ===== Left card (Recommendation) =====
  const RecCard = ({ rec }) => {
    const safeSrc = rec?.image || DEFAULT_AVATAR;
    return (
      <div className="p-4">
        <h2 className="text-lg md:text-2xl font-bold text-center font-cinzel mb-4">
          ACCOUNT INFORMATION
        </h2>
        <div className="bg-[#e9dcc4] rounded flex flex-row gap-4 p-5 md:p-6 shadow-[1px_1px_9px_1px_#afafaf] max-h-64 md:max-h-80 overflow-y-auto pr-2 thin-scrollbar">
          <img
            src={safeSrc}
            alt=""
            className="w-14 h-14 rounded-full object-cover"
            onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
          />
          <div className="flex flex-col gap-2 mb-3">
            <div className="font-semibold text-[#343a40]">
              You Recommended {rec?.name || "—"}
            </div>
            <div className="font-serif text-[16px] leading-7 text-[#212529] font-semibold whitespace-pre-wrap">
              {rec?.content || "Write a recommendation from the editor →"}
            </div>
            <div className="my-4">
              <a
                href={rec?.linkedin || "#"}
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-[#2b3b72] text-white px-4 py-2 rounded hover:opacity-90"
              >
                Visit Linkedin Profile
              </a>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={() => deleteRec(rec.id)}
            className="inline-flex items-center gap-2 text-sm px-3 py-2 bg-[#e74c3c] text-white rounded cursor-pointer"
          >
            <span>🗑</span> Delete this Recommendation
          </button>
        </div>
      </div>
    );
  };

  // ===== Right editor =====
  const Editor = ({ rec }) => {
    const [name, setName] = useState(rec?.name || "");
    const [linkedin, setLinkedin] = useState(rec?.linkedin || "");
    const [content, setContent] = useState(rec?.content || "");
    const [avatarUrl, setAvatarUrl] = useState(rec?.image || "");
    const [avatarFile, setAvatarFile] = useState(null); // track chosen file

    useEffect(() => {
      setName(rec?.name || "");
      setLinkedin(rec?.linkedin || "");
      setContent(rec?.content || "");
      setAvatarUrl(rec?.image || "");
      setEditorAvatarDataUrl(""); // clear local temp when switching
      setAvatarFile(null);
    }, [rec?.id]);

    const stopAll = (e) => e.stopPropagation();

    const handleFile = async (file) => {
      if (!file) return;
      if (!ACCEPTED_IMG.includes(file.type))
        return alert("Please upload a PNG / JPG / WEBP image.");
      if (file.size > MAX_IMG_MB * 1024 * 1024)
        return alert(`Image must be <= ${MAX_IMG_MB}MB.`);

      const dataUrl = await fileToDataUrl(file);
      setAvatarUrl(dataUrl); // preview immediately
      setEditorAvatarDataUrl(dataUrl);
      setAvatarFile(file); // keep the File for PATCH
    };

    return (
      <div
        className="h-full flex flex-col p-4"
        onMouseDownCapture={stopAll}
        onMouseMoveCapture={stopAll}
        onMouseUpCapture={stopAll}
        onTouchStartCapture={stopAll}
        onTouchMoveCapture={stopAll}
        onTouchEndCapture={stopAll}
        onPointerDownCapture={stopAll}
        onPointerMoveCapture={stopAll}
        onPointerUpCapture={stopAll}
        onWheelCapture={stopAll}
      >
        <h2 className="text-lg md:text-2xl font-bold text-center font-cinzel mb-4">
          EDIT THIS RECOMMENDATION
        </h2>

        {rec ? (
          <>
            {/* Avatar + uploader */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={avatarUrl || DEFAULT_AVATAR}
                alt="avatar"
                className="w-14 h-14 rounded-full object-cover border"
                onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
              />
              <label className="inline-flex items-center gap-2 px-3 py-2 rounded border cursor-pointer hover:bg-gray-50">
                <input
                  type="file"
                  accept={ACCEPTED_IMG.join(",")}
                  className="hidden"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) await handleFile(f);
                  }}
                />
                Upload Image
              </label>
            </div>

            <input
              className="w-full border-b p-2 mb-6 outline-none"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="w-full border-b p-2 mb-6 outline-none"
              placeholder="Linkedin Reference URL"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
            />

            <label className="text-sm font-semibold mb-2">Write Recommendation</label>
            <textarea
              className="flex-1 w-full resize-none outline-none rounded border border-gray-300 p-3"
              placeholder="Type your recommendation..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ touchAction: "auto" }}
            />

            <div className="mt-4 flex justify-center gap-2">
              <button
                className="px-5 py-2 rounded bg-[#232652] text-white hover:opacity-90"
                onClick={() =>
                  saveRec(
                    rec.id,
                    {
                      name,
                      linkedin,
                      content,
                      image: avatarUrl, // preview only, server will return final URL
                    },
                    avatarFile // <-- pass File to send multipart PATCH if changed
                  )
                }
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 rounded border border-gray-300 p-3 text-gray-500 flex items-center justify-center">
            Add a recommendation to begin.
          </div>
        )}
      </div>
    );
  };

  // ===== Build pages: pair for each recommendation (left card / right editor) =====
  const pages = useMemo(
    () =>
      recs.flatMap((r) => [
        <div key={`L-${r.id}`} className="bg-white">
          <RecCard rec={r} />
        </div>,
        <div key={`R-${r.id}`} className="bg-white">
          <Editor rec={r} />
        </div>,
      ]),
    [recs]
  );

  if (!mounted) return null;

  return (
    <div className="mx-auto my-5 w-[95vw] max-w-[1700px]">
      {/* Header action */}
      <div className="flex justify-between mb-3 items-center">
        <p className="text-base">Dashboard / Recommendation</p>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded bg-[#28d7a2] text-white hover:bg-emerald-600"
        >
          + Add Recommendation
        </button>
      </div>

      {/* Book frame */}
      <div className="relative border-[#1e1c4d] border-[12px] md:border-[19px] border-x-[20px] md:border-x-[30px] rounded-[10px] shadow-[0_8px_24px_rgba(0,0,0,0.15)] bg-white">
        <div className="p-3 md:p-6 overflow-hidden book-shadow">
          <HTMLFlipBook
            ref={bookRef}
            width={700}
            height={450}
            size="stretch"
            minWidth={550}
            maxWidth={1200}
            minHeight={380}
            maxHeight={900}
            maxShadowOpacity={0.2}
            mobileScrollSupport
            className="mx-auto"
            showPageCorners={false}
            disableFlipByClick={true}
            clickEventForward={false}
          >
            {pages}
          </HTMLFlipBook>
        </div>

        {/* ribbon */}
        <div className="absolute right-7 z-10">
          <Image src="/images/SHAPE.png" alt="ribbon" height={110} width={100} priority />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-6 mt-8">
        <button
          onClick={() => bookRef.current?.pageFlip()?.flipPrev()}
          className="px-1 py-1 bg-[#28d7a2] hover:bg-[#28d7a29b] absolute top-[40%] left-[8%]"
        >
          <IoMdArrowDropleft color="white" className="relative" size={30} />
        </button>
        <button
          onClick={() => bookRef.current?.pageFlip()?.flipNext()}
          className="px-1 py-1 bg-[#28d7a2] hover:bg-[#28d7a29b] absolute right-[3.8%] top-[40%]"
        >
          <IoMdArrowDropright color="white" className="relative" size={30} />
        </button>
      </div>

      {/* Add Recommendation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
          <div className="w-[92vw] max-w-xl rounded-lg bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Add Recommendation</h3>
              <button
                className="px-2 py-1 text-sm rounded border hover:bg-gray-50"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>

            <form onSubmit={addRec} className="space-y-3">
              {/* Avatar upload with preview */}
              <div className="flex items-center gap-4">
                <img
                  src={newAvatarDataUrl || DEFAULT_AVATAR}
                  alt="preview"
                  className="w-14 h-14 rounded-full object-cover border"
                  onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
                />
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded border cursor-pointer hover:bg-gray-50">
                  <input
                    type="file"
                    accept={ACCEPTED_IMG.join(",")}
                    className="hidden"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      if (!ACCEPTED_IMG.includes(f.type)) {
                        alert("Please upload a PNG / JPG / WEBP image.");
                        return;
                      }
                      if (f.size > MAX_IMG_MB * 1024 * 1024) {
                        alert(`Image must be <= ${MAX_IMG_MB}MB.`);
                        return;
                      }
                      setNewAvatarFile(f); // keep File for POST
                      setNewAvatarDataUrl(await fileToDataUrl(f)); // preview
                    }}
                  />
                  Upload Image
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded border p-2 outline-none"
                  placeholder="e.g., Nuno Martins"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Linkedin URL</label>
                <input
                  value={newLinkedin}
                  onChange={(e) => setNewLinkedin(e.target.value)}
                  className="w-full rounded border p-2 outline-none"
                  placeholder="https://www.linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={6}
                  className="w-full rounded border p-2 outline-none"
                  placeholder="Write the recommendation text..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded border hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-emerald-500 text-white hover:bg-emerald-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
