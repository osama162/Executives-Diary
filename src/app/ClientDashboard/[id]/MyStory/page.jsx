"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Play } from "lucide-react";

// Disable SSR for react-pageflip
const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false });

export default function StoryBook() {
  const { id: executiveId } = useParams(); // /ClientDashboard/[id]/Story
  const API_BASE = (process.env.NEXT_PUBLIC_API_DOMAIN || "").replace(/\/$/, "");
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const authHeadersJSON = { Authorization: `Token ${token}`, "Content-Type": "application/json" };

  const bookRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // data
  const [chapters, setChapters] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // create modal
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  // helpers
  const goToPage = useCallback((n) => {
    try { bookRef.current?.pageFlip()?.flip(n); } catch { }
  }, []);
  const updateFromHtml = useCallback(() => {
    try { bookRef.current?.pageFlip()?.updateFromHtml(); } catch { }
  }, []);
  const rafHandle = useRef(null);
  const rafRefresh = useCallback(() => {
    if (rafHandle.current) cancelAnimationFrame(rafHandle.current);
    rafHandle.current = requestAnimationFrame(updateFromHtml);
  }, [updateFromHtml]);

  const selectedChapter = useMemo(
    () => chapters.find((c) => c.id === selectedId) || null,
    [chapters, selectedId]
  );

  // API
  const loadChapters = useCallback(async () => {
    if (!executiveId || !token) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${API_BASE}/api/executives/executive-chapters/?executive_id=${executiveId}`,
        { headers: { Authorization: `Token ${token}` } }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to fetch chapters");
      const items = json?.data ?? json;
      const list = Array.isArray(items) ? items : [];
      setChapters(list);
      setSelectedId((prev) => prev ?? (list?.[0]?.id ?? null));
    } catch (e) {
      setError(e.message || "Failed to load chapters");
    } finally {
      setLoading(false);
      rafRefresh();
    }
  }, [API_BASE, executiveId, token, rafRefresh]);

  useEffect(() => { loadChapters(); }, [loadChapters]);

  const createChapter = async ({ title }) => {
    if (!title?.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/executives/executive-chapters/`, {
        method: "POST",
        headers: authHeadersJSON,
        body: JSON.stringify({ executive: executiveId, title }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to create chapter");
      const created = json?.data ?? json;

      setChapters((prev) => [...prev, created]);
      setSelectedId(created.id);
      setShowModal(false);
      setNewTitle("");

      requestAnimationFrame(() => {
        goToPage(1);  // right page (editor)
        rafRefresh();
      });
    } catch (e) {
      alert(e.message || "Create failed");
    } finally {
      setSaving(false);
    }
  };

  const uploadChapterImage = async ({ chapterId, file, caption = "" }) => {
    const fd = new FormData();
    fd.append("chapter", String(chapterId));
    fd.append("caption", caption);
    fd.append("image", file);

    const res = await fetch(`${API_BASE}/api/executives/executive-chapter-images/`, {
      method: "POST",
      headers: { Authorization: `Token ${token}` },
      body: fd,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.message || "Failed to upload image");
    const created = json?.data ?? json;

    setChapters((prev) =>
      prev.map((c) =>
        c.id === chapterId
          ? { ...c, images: Array.isArray(c.images) ? [created, ...c.images] : [created] }
          : c
      )
    );
    rafRefresh();
  };

  // Right-side Editor (edit title/content, show images beneath, upload)
  const Editor = ({ chapter }) => {
    const [title, setTitle] = useState(chapter?.title ?? "");
    const [text, setText] = useState(chapter?.content ?? "");
    const [imageFile, setImageFile] = useState(null);
    const [caption, setCaption] = useState("");
    const [busy, setBusy] = useState(false);

    useEffect(() => {
      setTitle(chapter?.title ?? "");
      setText(chapter?.content ?? "");
      setImageFile(null);
      setCaption("");
    }, [chapter?.id]);

    const onTitleChange = (e) => {
      const next = e.target.value;
      setTitle(next);
      // live reflect in TOC list
      setChapters((prev) => prev.map((c) => (c.id === chapter.id ? { ...c, title: next } : c)));
      rafRefresh();
    };

    const handleSave = async () => {
      if (!chapter) return;
      setBusy(true);
      try {
        const patch = {};
        if (title !== (chapter.title ?? "")) patch.title = title;
        if (text !== (chapter.content ?? "")) patch.content = text;

        if (Object.keys(patch).length) {
          const res = await fetch(`${API_BASE}/api/executives/executive-chapters/${chapter.id}/`, {
            method: "PATCH",
            headers: authHeadersJSON,
            body: JSON.stringify(patch),
          });
          const json = await res.json();
          if (!res.ok) throw new Error(json?.message || "Failed to update chapter");
          const updated = json?.data ?? json;
          setChapters((prev) => prev.map((c) => (c.id === chapter.id ? { ...c, ...updated } : c)));
        }

        if (imageFile) {
          await uploadChapterImage({ chapterId: chapter.id, file: imageFile, caption });
          setImageFile(null);
          setCaption("");
        }
      } catch (e) {
        alert(e.message || "Save failed");
      } finally {
        setBusy(false);
      }
    };

    if (!chapter) {
      return (
        <div className="h-full p-6 bg-white">
          <h2 className="text-2xl font-semibold text-center font-cinzel mb-2">EDITOR</h2>
          <div className="h-[330px] rounded border border-gray-300 p-3 text-gray-500 flex items-center justify-center">
            Select a chapter from the left.
          </div>
        </div>
      );
    }

    // prevent flipbook from eating input events
    const stopAll = (e) => e.stopPropagation();

return (
  <div
    className="h-full flex flex-col p-6 bg-white"
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
    <h2 className="text-2xl font-semibold text-center font-cinzel mb-2">EDITOR</h2>

    {/* Scrollable editor body */}
    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
      {/* Title */}
      <input
        value={title}
        onChange={onTitleChange}
        placeholder="Chapter title"
        className="w-full rounded border border-gray-300 p-2 outline-none"
      />

      {/* Content */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full resize-none outline-none rounded border border-gray-300 p-3"
        placeholder="Write content…"
        style={{ minHeight: "150px", touchAction: "auto" }}
      />

      {/* Existing images */}
      <div>
        <h4 className="font-semibold mb-2">Images</h4>
        {Array.isArray(chapter.images) && chapter.images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {chapter.images.map((img) => (
              <figure key={img.id} className="rounded overflow-hidden border bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.image}
                  alt={img.caption || "chapter image"}
                  className="w-full h-24 object-cover"
                />
                {img.caption ? (
                  <figcaption className="px-2 py-1 text-xs text-gray-600">{img.caption}</figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        ) : (
          <div className="text-xs text-gray-500">No images yet.</div>
        )}
      </div>

      {/* Upload new image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="input-field file:mr-4 file:py-2 file:px-4 file:rounded 
                     file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 
                     hover:file:bg-gray-200"
        />
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Image caption (optional)"
          className="mt-2 w-full rounded border border-gray-300 p-2 outline-none"
        />
      </div>
    </div>

    {/* Save stays pinned at bottom */}
    <div className="mt-4 flex justify-center">
      <button
        onClick={handleSave}
        className="px-6 py-2 rounded bg-[#1b1b4a] text-white hover:bg-[#1b1b4a] disabled:opacity-60 cursor-pointer"
        disabled={busy}
      >
        {busy ? "Saving…" : "Save"}
      </button>
    </div>
  </div>
);

  };

  // Only TWO pages: LEFT (TOC) + RIGHT (Editor)
  const pages = useMemo(() => {
    const tocLeft = (
      <div key="toc-left" className="p-6 bg-white">
        <h2 className="text-lg md:text-2xl font-bold text-center text-gray-800 mb-3 font-cinzel">
          Chapters
        </h2>
        <hr className="mb-3" />
        <div className="h-[330px] overflow-y-auto pr-2">
          {chapters.length === 0 ? (
            <div className="text-gray-500">No chapters yet.</div>
          ) : (
            <ul className="space-y-2">
              {chapters.map((c, i) => (
                <li
                  key={`toc-${c.id}`}
                  className={`cursor-pointer rounded border p-3 hover:bg-gray-50 ${selectedId === c.id ? "border-[#232652]" : "border-gray-200"
                    }`}
                  onClick={() => {
                    setSelectedId(c.id);
                    requestAnimationFrame(() => goToPage(1)); // always open right editor page
                  }}
                >
                  <div className="text-sm text-gray-500">Chapter {i + 1}</div>
                  <div className="font-semibold truncate">{c.title || "Untitled Chapter"}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );

    const editorRight = (
      <div key="editor-right" className="bg-white h-full">
        <Editor chapter={selectedChapter} />
      </div>
    );

    return [tocLeft, editorRight];
  }, [chapters, selectedId, selectedChapter, goToPage]);

  if (!mounted) return null;

  return (
    <div className="mx-auto my-5 w-[95vw] max-w-[1700px]">
      <h3 className="text-[#a3a19e]">
        <span className="text-black font-medium">Dashboard </span>/ Chapter
      </h3>

      <div className="flex justify-end mb-3">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded bg-[#1b1b4a] text-white hover:bg-[#1b1b4a] cursor-pointer"
        >
          + Add Chapter
        </button>
      </div>

      <div className="relative border-[#1e1c4d] border-[12px] md:border-[19px] border-x-[20px] md:border-x-[30px] rounded-[10px] shadow-[0_8px_24px_rgba(0,0,0,0.15)] bg-white">
        {error && <div className="m-4 rounded bg-red-50 text-red-700 px-3 py-2">{error}</div>}

        <div className="p-3 md:p-6 book-shadow overflow-hidden">
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
            startZIndex={300}
          >
            {pages}
          </HTMLFlipBook>
        </div>

        {/* ribbon */}
        <div className="absolute right-7 z-10">
          <Image src="/images/SHAPE.png" alt="ribbon" height={110} width={100} priority />
        </div>
      </div>

      {/* Nav */}
      <div className="flex justify-center gap-6 mt-8">
        <button
          onClick={() => bookRef.current?.pageFlip()?.flipPrev()}
          className="px-4 py-2 rounded bg-[#1b1b4a] hover:bg-gray-300"
          aria-label="Previous"
        >
          <Play color="white" className="relative rotate-180" />
        </button>
        <button
          onClick={() => bookRef.current?.pageFlip()?.flipNext()}
          className="px-4 py-2 rounded bg-[#1b1b4a] hover:bg-gray-300"
          aria-label="Next"
        >
          <Play color="white" />
        </button>
      </div>

      {/* Create chapter modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
          <div className="w-[92vw] max-w-xl rounded-lg bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Add Chapter</h3>
              {/* <button
                className="px-2 py-1 text-sm rounded border hover:bg-gray-50"
                onClick={() => setShowModal(false)}
              >
                Close
              </button> */}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createChapter({ title: newTitle }); // only title
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Chapter Name</label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded border p-2 outline-none"
                  placeholder="e.g., Leadership Advice"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded border hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#1b1b4a] text-white hover:bg-[#1b1b4a] cursor-pointer"
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save Chapter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
