// app/Diaries/Diary/[id]/Chapters/page.jsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import Image from "next/image";
import NavigationButtons from "../../../../../components/NavigationButtons";

const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false });

const DiaryChapterPage = () => {
  const bookRef = useRef(null);
  const { id } = useParams();
  const API_BASE = process.env.NEXT_PUBLIC_API_DOMAIN;

  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);

  // add form state placeholders (if you'll use them later)
  const [newTitle] = useState("");
  const [newImages] = useState([]);
  const [newContent] = useState("");

  const getChapters = useCallback(async () => {
    try {
      if (!API_BASE)
        throw new Error("API_BASE is empty; set NEXT_PUBLIC_API_DOMAIN");

      const qs = new URLSearchParams({ executive_id: String(id) });
      const url = `${API_BASE}/api/executives/executive-chapters/?${qs.toString()}`;
      const res = await fetch(url, {
        cache: "no-store",
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
      }

      const data = await res.json();
      console.log(data);
      // Normalize: always ensure strings and images as arrays
      const normalized = (data?.data ?? []).map((r) => ({
        id: r.id,
        executive: r.executive,
        title: r.title || "",
        // images could be an array of URLs or array of objects { image, caption }
        images: Array.isArray(r.images) ? r.images : [],
        content: r.content || "",
      }));
      setChapters(normalized);
    } catch (err) {
      console.error("getChapters failed:", err);
      setChapters([]); // fail safe
    }
  }, [API_BASE, id]);

  console.log(chapters);
  useEffect(() => {
    getChapters();
  }, [getChapters]);

  // Set first chapter as selected by default
  useEffect(() => {
    if (chapters.length > 0 && !selectedChapter) {
      setSelectedChapter(chapters[0]);
    }
  }, [chapters, selectedChapter]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Test book initialization
  useEffect(() => {
    if (mounted) {
      setTimeout(() => {
        console.log("=== CHAPTERS BOOK INITIALIZATION TEST ===");
        console.log("bookRef.current:", bookRef.current);
        const api = bookRef.current?.pageFlip?.();
        console.log("pageFlip API:", api);
        if (api) {
          console.log("Initial current page:", api.getCurrentPageIndex?.());
          console.log("Total pages:", api.getPageCount?.());
        }
      }, 1000);
    }
  }, [mounted]);

  const refreshBook = useCallback(() => {
    requestAnimationFrame(() => {
      try {
        bookRef.current?.pageFlip()?.updateFromHtml();
      } catch {}
    });
  }, []);

  const playFlipSound = () => {
    try {
      const audio = document.getElementById("flip-audio");
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {
          // Ignore audio play errors
        });
      }
    } catch (error) {
      // Ignore audio errors
    }
  };

  const goPrev = () => {
    const api = bookRef.current?.pageFlip?.();
    if (api) {
      playFlipSound();
      api.flipPrev?.();
    }
  };

  const goNext = () => {
    const api = bookRef.current?.pageFlip?.();
    if (api) {
      playFlipSound();
      api.flipNext?.();
    }
  };

  /* ---------------------- Left page: TOC ---------------------- */
  const TOC = () => {
    return (
      <div className="px-[31px] py-[10px] bg-white h-full overflow-auto custom-scrollbar">
        <h2 className="text-3xl font-extrabold text-center font-cinzel mb-4">
          Pages
        </h2>

        {chapters.length === 0 ? (
          <div className="text-gray-500 text-sm text-center">No pages yet.</div>
        ) : (
          <ol className="list-decimal pl-6 space-y-2 max-h-[420px] ">
            {chapters.map((c) => (
              <li
                key={c.id}
                className={`leading-relaxed text-[#212529] cursor-pointer hover:text-[#1dd1a1] transition-colors duration-200 ${
                  selectedChapter?.id === c.id
                    ? "text-[#1dd1a1] font-semibold"
                    : ""
                }`}
                onClick={() => {
                  setSelectedChapter(c);
                  goNext();
                }}
              >
                {c.title || "Untitled"}
              </li>
            ))}
          </ol>
        )}
      </div>
    );
  };

  /* --------------------- Right page: Chapter ------------------- */
  const PostViewer = ({ post }) => {
    // Use selectedChapter if available, otherwise fall back to post prop
    const chapter = selectedChapter || post;

    if (!chapter) {
      return (
        <div className="px-[31px] py-[10px] bg-white h-full flex items-center justify-center text-gray-500 overflow-y-auto custom-scrollbar">
          Select a chapter from the list to view its content.
        </div>
      );
    }

    const { images, title, content } = chapter;

    return (
      <div className="px-[31px] py-[10px] bg-white h-full flex flex-col overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-6 mb-6">
          <span className="text-base uppercase text-gray-700 font-semibold border-b-4 border-double w-full pb-3">
            pages
          </span>
        </div>

        <h3 className="text-xl md:text-3xl font-bold mb-4 text-[#212529] capitalize">
          {title || "Untitled"}
        </h3>

        {/* Scrollable content so nothing overflows */}
        <div className="flex-1 pr-2 space-y-4">
          {content ? (
            <p className="text-[#212529] leading-7 whitespace-pre-line">
              {content}
            </p>
          ) : (
            <p className="text-gray-500">No content.</p>
          )}

          {(images ?? []).length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {(images ?? []).map((img, idx) => {
                // support string URL or object with { image, caption }
                const src = typeof img === "string" ? img : img?.image;
                const alt =
                  typeof img === "string"
                    ? "chapter image"
                    : img?.caption || "chapter image";
                if (!src) return null;
                return (
                  <figure
                    key={idx}
                    className="rounded overflow-hidden border bg-white"
                  >
                    <Image
                      src={src}
                      alt={alt}
                      width={600}
                      height={600}
                      className="w-full h-36 object-cover"
                    />
                    {typeof img !== "string" && img?.caption ? (
                      <figcaption className="px-2 py-1 text-xs text-gray-600">
                        {img.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  /* ------------------------ Page pairs ------------------------ */
  const pages = useMemo(
    () => [
      <div
        key="toc"
        className="h-full bg-white overflow-y-auto custom-scrollbar"
      >
        <TOC />
      </div>,
      <div
        key="viewer"
        className="h-full bg-white overflow-y-auto custom-scrollbar"
      >
        <PostViewer />
      </div>,
    ],
    [selectedChapter]
  );

  if (!mounted) return null;

  return (
    <>
      <NavigationButtons />
      <div className="mx-14 mt-4">
        <div className="border-[#1e1c4d] border-[19px] border-x-[30px] rounded-[10px] mx-10 my-2 relative overflow-visible">
          <div className="bg-white rounded-md overflow-visible relative">
            <div className="relative book-shadow overflow-visible">
              <div className="mx-auto overflow-hidden">
                <HTMLFlipBook
                  ref={bookRef}
                  width={725}
                  height={550.25}
                  size="stretch"
                  minWidth={480}
                  maxWidth={725}
                  minHeight={420.25}
                  maxHeight={550.25}
                  maxShadowOpacity={0.2}
                  showCover={false}
                  usePortrait={true}
                  drawShadow={true}
                  className="!overflow-visible"
                  showPageCorners={false}
                  disableFlipByClick={false}
                  useMouseEvents={true}
                  flippingTime={1000}
                  swipeDistance={30}
                  onFlip={(e) => {
                    console.log("Flip event triggered:", e);
                  }}
                >
                  {pages}
                </HTMLFlipBook>
              </div>
              <div className="absolute right-7 z-10">
                <Image
                  src="/images/SHAPE.png"
                  alt="ribbon"
                  height={110}
                  width={100}
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Arrows - Flip between left page (list) and right page (details) */}
        <div className="flex justify-center gap-2 absolute bottom-[calc(var(--spacing)*8)] left-0 right-0">
          <button
            onClick={goPrev}
            className="w-12 h-12 hover:bg-[#28d7a2] bg-[#1b1b4a] text-white grid place-items-center cursor-pointer"
            aria-label="Previous"
            title="Go to list page"
          >
            <IoMdArrowDropleft color="white" size={30} />
          </button>
          <button
            onClick={goNext}
            className="w-12 h-12 hover:bg-[#28d7a2] bg-[#1b1b4a] text-white grid place-items-center cursor-pointer"
            aria-label="Next"
            title="Go to details page"
          >
            <IoMdArrowDropright color="white" size={30} />
          </button>
        </div>

        <audio id="flip-audio" src="/flip.mp3" preload="auto" />
      </div>
    </>
  );
};

export default DiaryChapterPage;
