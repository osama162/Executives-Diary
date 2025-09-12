// app/Diaries/Diary/[id]/Chapters/page.jsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import Image from "next/image";

const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false });

const DiaryChapterPage = () => {
    const bookRef = useRef(null);
    const { id } = useParams();
    const API_BASE = process.env.NEXT_PUBLIC_API_DOMAIN;
    const token =
        typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const [chapters, setChapters] = useState([]);

    // add form state placeholders (if you’ll use them later)
    const [newTitle] = useState("");
    const [newImages] = useState([]);
    const [newContent] = useState("");

    const getChapters = useCallback(async () => {
        try {
            if (!API_BASE) throw new Error("API_BASE is empty; set NEXT_PUBLIC_API_DOMAIN");
            if (!token) {
                console.warn("No auth token yet; skip fetching");
                return;
            }

            const qs = new URLSearchParams({ executive_id: String(id) });
            const url = `${API_BASE}/api/executives/executive-chapters/?${qs.toString()}`;
            const res = await fetch(url, {
                headers: { Authorization: `Token ${token}` },
                cache: "no-store",
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
            }

            const data = await res.json();

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
    }, [API_BASE, token, id]);

    useEffect(() => {
        getChapters();
    }, [getChapters]);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const refreshBook = useCallback(() => {
        requestAnimationFrame(() => {
            try {
                bookRef.current?.pageFlip()?.updateFromHtml();
            } catch { }
        });
    }, []);

    /* ---------------------- Left page: TOC ---------------------- */
    const TOC = () => {
        return (
            <div className="p-6 bg-white h-full">
                <h2 className="text-3xl font-extrabold text-center font-cinzel mb-4">
                    Pages
                </h2>

                {chapters.length === 0 ? (
                    <div className="text-gray-500 text-sm text-center">No pages yet.</div>
                ) : (
                    <ol className="list-decimal pl-6 space-y-2 max-h-[420px] overflow-auto thin-scrollbar">
                        {chapters.map((c) => (
                            <li key={c.id} className="leading-relaxed text-[#212529]">
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
        if (!post) {
            return (
                <div className="p-6 bg-white h-full flex items-center justify-center text-gray-500">
                    No pages selected.
                </div>
            );
        }

        const { images, title, content } = post;

        return (
            <div className="p-6 bg-white h-full flex flex-col">
                <div className="flex items-center gap-6 mb-6">
                    <span className="text-base uppercase text-gray-700 font-semibold border-b-4 border-double w-full pb-3">
                        pages
                    </span>
                </div>

                <h3 className="text-xl md:text-3xl font-bold mb-4 text-[#212529] capitalize">
                    {title || "Untitled"}
                </h3>

                {/* Scrollable content so nothing overflows */}
                <div className="flex-1 overflow-y-auto thin-scrollbar pr-2 space-y-4">
                    {content ? (
                        <p className="text-[#212529] leading-7 whitespace-pre-line">{content}</p>
                    ) : (
                        <p className="text-gray-500">No content.</p>
                    )}

                    {(images ?? []).length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {(images ?? []).map((img, idx) => {
                                // support string URL or object with { image, caption }
                                const src = typeof img === "string" ? img : img?.image;
                                const alt = typeof img === "string" ? "chapter image" : img?.caption || "chapter image";
                                if (!src) return null;
                                return (
                                    <figure key={idx} className="rounded overflow-hidden border bg-white">
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
        () =>
            chapters.flatMap((c) => [
                <div key={`toc-${c.id}`} className="bg-white overflow-y-auto custom-scrollbar">
                    <TOC />
                </div>,
                <div key={`viewer-${c.id}`} className="bg-white overflow-y-auto custom-scrollbar">
                    <PostViewer post={c} />
                </div>,
            ]),
        [chapters]
    );

    if (!mounted) return null;

    return (
        <div className="mx-auto my-10 w-[95vw] max-w-[1700px]">
            <div className="relative border-[#1e1c4d] border-[12px] md:border-[19px] border-x-[20px] md:border-x-[30px] rounded-[10px] shadow bg-white">
                <div className="overflow-hidden book-shadow">
                    <HTMLFlipBook
                        ref={bookRef}
                        width={700}
                        height={580}
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
                <div className="absolute right-7 z-10">
                    <Image src="/images/SHAPE.png" alt="ribbon" height={110} width={100} priority />
                </div>
            </div>

            <div className="flex justify-center gap-2 mt-8">
                <button
                    onClick={() => bookRef.current?.pageFlip()?.flipPrev()}
                    className="w-12 h-12 hover:bg-[#28d7a2] bg-[#1b1b4a] text-white grid place-items-center cursor-pointer"
                    aria-label="Previous"
                >
                    <IoMdArrowDropleft color="white" size={30} />
                </button>
                <button
                    onClick={() => bookRef.current?.pageFlip()?.flipNext()}
                    className="w-12 h-12 hover:bg-[#28d7a2] bg-[#1b1b4a] text-white grid place-items-center cursor-pointer"
                    aria-label="Next"
                >
                    <IoMdArrowDropright color="white" size={30} />
                </button>
            </div>
        </div>
    );
};

export default DiaryChapterPage;
