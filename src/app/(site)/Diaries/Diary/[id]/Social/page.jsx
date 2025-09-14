"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import Image from "next/image";
import { FaEdit, FaTrash } from "react-icons/fa";
import NavigationButtons from "../../../../../components/NavigationButtons";

const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false });

const PLATFORMS = ["youtube", "facebook", "linkedin"];

const toYouTubeEmbed = (url) => {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (u.pathname.startsWith("/embed/")) return url;
    }
  } catch {}
  return url;
};

const toTitle = (s) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;

const DiarySocialPage = () => {
  const bookRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Test book initialization
  useEffect(() => {
    if (mounted) {
      setTimeout(() => {
        console.log("=== SOCIAL BOOK INITIALIZATION TEST ===");
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

  const { id } = useParams();
  const API_BASE = process.env.NEXT_PUBLIC_API_DOMAIN;

  const [posts1, setPosts1] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  // Add modal (create)
  const [showModal, setShowModal] = useState(false);
  const [newPlatform, setNewPlatform] = useState("youtube");
  const [newUrl, setNewUrl] = useState("");
  const [newCaption, setNewCaption] = useState("");

  // Edit modal (update)
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPost, setEditPost] = useState(null); // full object
  const [editPlatform, setEditPlatform] = useState("youtube");
  const [editUrl, setEditUrl] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [executiveName, setExecutiveName] = useState("");

  const getExecutiveName = async () => {
    const url = `${API_BASE}/api/executives/${id}`;
    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
    }
    const data = await res.json();
    console.log("name", data.data.diary_title);
    setExecutiveName(data.data.diary_title);
  };
  const getPost = useCallback(async () => {
    try {
      if (!API_BASE)
        throw new Error("API_BASE is empty; set NEXT_PUBLIC_API_DOMAIN");

      const qs = new URLSearchParams({ executive_id: String(id) });
      const url = `${API_BASE}/api/executives/executive-social-posts/?${qs.toString()}`;
      const res = await fetch(url, {
        cache: "no-store",
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
      }

      const data = await res.json();

      // keep raw fields but ensure we always have strings
      const normalized = (data?.data ?? []).map((r) => ({
        id: r.id,
        executive: r.executive,
        platform: r.platform || "",
        url: r.url || "",
        caption: r.caption || "",
        posted_at: r.posted_at || "",
        created_at: r.created_at || "",
      }));
      setPosts1(normalized);
    } catch (err) {
      console.error("getRecommendations failed:", err);
      setPosts1([]); // fail safe
    }
  }, [API_BASE, id]);

  useEffect(() => {
    getPost();
    getExecutiveName();
  }, [getPost]);

  // Set first post as selected by default
  useEffect(() => {
    if (posts1.length > 0 && !selectedPost) {
      setSelectedPost(posts1[0]);
    }
  }, [posts1, selectedPost]);

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

  // --------- CREATE ---------
  const addPost = async (e) => {
    e?.preventDefault?.();
    if (!newUrl.trim()) return;
    const newPost = {
      executive: Number(id),
      platform: toTitle(newPlatform), // API expects Title-case (based on your examples)
      url: newUrl.trim(),
      caption: newCaption.trim(),
      posted_at: "2018-12-15",
    };

    try {
      const res = await fetch(
        `${API_BASE}/api/executives/executive-social-posts/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(newPost),
        }
      );

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        console.error("Create failed", res.status, t);
        alert("Failed to create post.");
        return;
      }

      const created = await res.json();
      const c = created?.data ?? created ?? null;
      if (c) {
        setPosts1((prev) => [
          ...prev,
          {
            id: c.id,
            executive: c.executive,
            platform: c.platform || "",
            url: c.url || "",
            caption: c.caption || "",
            posted_at: c.posted_at || "",
            created_at: c.created_at || "",
          },
        ]);
      }

      setShowModal(false);
      setNewPlatform("youtube");
      setNewUrl("");
      setNewCaption("");
      refreshBook();
      window.location.reload();
    } catch (err) {
      console.log("addPost error", err);
      alert("Failed to create post.");
    }
  };

  // --------- PATCH ---------
  const saveEdit = async (e) => {
    e?.preventDefault?.();
    if (!editPost) return;

    const payload = {
      // send fields the API accepts; platform in Title-case if your API expects it
      platform: toTitle(editPlatform),
      url: editUrl.trim(),
      caption: editCaption.trim(),
    };

    try {
      const res = await fetch(
        `${API_BASE}/api/executives/executive-social-posts/${editPost.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        console.error("Update failed", res.status, t);
        alert("Failed to update post.");
        return;
      }

      const updated = await res.json();
      const u = updated?.data ?? updated ?? null;

      setPosts1((prev) =>
        prev.map((p) =>
          p.id === editPost.id
            ? {
                ...p,
                platform: u?.platform ?? payload.platform,
                url: u?.url ?? payload.url,
                caption: u?.caption ?? payload.caption,
              }
            : p
        )
      );

      setShowEditModal(false);
      setEditPost(null);
      refreshBook();
    } catch (err) {
      console.error("Update error", err);
      alert("Failed to update post.");
    }
  };

  // --------- TOC ---------
  const TOC = () => {
    const grouped = PLATFORMS.map((p) => ({
      platform: p,
      items: posts1.filter((x) => (x.platform || "").toLowerCase() === p),
    })).filter((g) => g.items.length > 0); // keep only groups with data

    return (
      <div className="px-[31px] py-[10px] bg-white overflow-y-auto custom-scrollbar">
        <h2 className="text-3xl font-extrabold mx-auto mb-4 bg-[#ffe135] p-2 text-[#424242] w-fit text-center capitalize ">
          From the social diaries of {executiveName}
        </h2>

        {grouped.length === 0 ? (
          <div className="text-gray-500 text-sm text-center">No posts yet.</div>
        ) : (
          grouped.map(({ platform, items }) => (
            <div key={platform} className="mb-3 mt-3">
              <h3 className="text-lg md:text-xl text-center my-3 font-semibold">
                {platform.toUpperCase()}
              </h3>
              <ol className="list-decimal pl-6 space-y-2">
                {items.map((p) => (
                  <li
                    key={p.id}
                    className={`leading-relaxed text-sm cursor-pointer transition-colors duration-200 ${
                      selectedPost?.id === p.id
                        ? "text-[#1dd1a1] font-semibold"
                        : "hover:text-[#1dd1a1]"
                    }`}
                    onClick={() => {
                      setSelectedPost(p);
                      goNext();
                    }}
                  >
                    {p.caption}
                  </li>
                ))}
              </ol>
            </div>
          ))
        )}
      </div>
    );
  };

  // --------- Right page viewer ---------
  const PostViewer = ({ post }) => {
    // Use selectedPost if available, otherwise fall back to post prop
    const currentPost = selectedPost || post;

    if (!currentPost) {
      return (
        <div className="px-[31px] py-[10px] bg-white h-full flex items-center justify-center text-gray-500 overflow-y-auto custom-scrollbar">
          Select a post from the list to view its content.
        </div>
      );
    }

    const { platform, url, caption, id } = currentPost;
    const platformLc = (platform || "").toLowerCase();

    // Decide what we can embed
    const canEmbedYouTube =
      url.includes("youtube.com") || url.includes("youtu.be");
    const fbEmbedSrc = platformLc === "facebook" ? getFacebookEmbed(url) : null;
    const liEmbedSrc = platformLc === "linkedin" ? getLinkedInEmbed(url) : null;

    // A small helper to render an iframe consistently
    const IFrame = ({ src, title }) =>
      src ? (
        <div className="w-full overflow-hidden flex justify-center items-center">
          <iframe
            src={src}
            title={title}
            className="w-full h-[360px] md:h-[420px]" // adjust heights to taste
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : null;

    return (
      <div className="px-[31px] py-[10px] bg-white h-full flex flex-col overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-6 mb-8">
          <span className="text-base capitalize text-[#212529] font-semibold border-b-4 border-double w-full pb-4">
            {platform}
          </span>
        </div>

        <h3 className="text-lg font-bold mb-3 text-[#212529] capitalize">
          {caption}
        </h3>

        {/* Scrollable content so embeds never overflow the page */}
        <div className="flex-1 r pr-2">
          {platformLc === "youtube" && canEmbedYouTube && (
            <IFrame src={toYouTubeEmbed(url)} title="YouTube video" />
          )}

          {platformLc === "facebook" && (
            <>
              {fbEmbedSrc ? (
                <IFrame src={fbEmbedSrc} title="Facebook post" />
              ) : (
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded border p-4 hover:bg-gray-50 break-all"
                >
                  <div className="text-sm text-gray-600 mb-1">
                    Open Facebook post
                  </div>
                  <div className="text-[#1d4ed8]">{url}</div>
                </a>
              )}
            </>
          )}

          {platformLc === "linkedin" && (
            <>
              {liEmbedSrc ? (
                <IFrame src={liEmbedSrc} title="LinkedIn post" />
              ) : (
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded border p-4 hover:bg-gray-50 break-all"
                >
                  <div className="text-sm text-gray-600 mb-1">
                    Open LinkedIn post
                  </div>
                  <div className="text-[#1d4ed8]">{url}</div>
                </a>
              )}
            </>
          )}

          {/* Fallback for any other/unknown platform */}
          {platformLc !== "youtube" &&
            platformLc !== "facebook" &&
            platformLc !== "linkedin" && (
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="block rounded border p-4 hover:bg-gray-50 break-all"
              >
                <div className="text-sm text-gray-600 mb-1">Open post</div>
                <div className="text-[#1d4ed8]">{url}</div>
              </a>
            )}
        </div>
      </div>
    );
  };

  // Build a Facebook embed iframe URL (no SDK needed)
  const getFacebookEmbed = (url, width = 540) => {
    // You can tune width/height; height is controlled by the iframe element
    return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(
      url
    )}&show_text=true&width=${width}`;
  };

  // Try to build a LinkedIn embed URL.
  // Works directly if the URL already contains a URN (e.g. .../update/urn:li:ugcPost:XXXX).
  // If we can't derive a valid embed URL, return null and we’ll fall back to a link.
  const getLinkedInEmbed = (url) => {
    try {
      // Already an embed URL?
      if (url.includes("linkedin.com/embed/")) return url;

      // Pattern 1: URL contains an explicit URN
      const urn = url.match(/urn:li:[\w:]+/);
      if (urn && urn[0]) {
        return `https://www.linkedin.com/embed/feed/update/${urn[0]}`;
      }

      // Pattern 2: A feed/update URL with URN after it
      const idx = url.indexOf("/feed/update/");
      if (idx !== -1) {
        const tail = url.slice(idx + "/feed/update/".length);
        if (tail.startsWith("urn:li:")) {
          return `https://www.linkedin.com/embed/feed/update/${tail}`;
        }
      }

      // If we’re here, we couldn’t safely derive an embeddable URL
      return null;
    } catch {
      return null;
    }
  };

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
    [selectedPost, executiveName]
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
                    console.log("Social flip event triggered:", e);
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

        <div className="flex justify-center gap-2 mt-8 absolute bottom-[calc(var(--spacing)*8)] left-0 right-0">
          <button
            onClick={goPrev}
            className="w-12 h-12 hover:bg-[#28d7a2]  bg-[#1b1b4a] text-white grid place-items-center cursor-pointer"
            aria-label="Previous"
            title="Go to list page"
          >
            <IoMdArrowDropleft color="white" className="relative" size={30} />
          </button>
          <button
            onClick={goNext}
            className="w-12 h-12 hover:bg-[#28d7a2] bg-[#1b1b4a] text-white grid place-items-center cursor-pointer"
            aria-label="Next"
            title="Go to details page"
          >
            <IoMdArrowDropright color="white" className="relative" size={30} />
          </button>
        </div>

        {/* Add Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
            <div className="w-[92vw] max-w-xl rounded-lg bg-white p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Add Social Post</h3>
                <button
                  className="px-2 py-1 text-sm rounded border hover:bg-gray-50"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
              <form onSubmit={addPost} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Platform
                  </label>
                  <select
                    className="w-full rounded border p-2 outline-none"
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL</label>
                  <input
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full rounded border p-2 outline-none"
                    placeholder="Paste the post or video URL"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Caption
                  </label>
                  <textarea
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    rows={4}
                    className="w-full rounded border p-2 outline-none"
                    placeholder="Write a caption"
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

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
            <div className="w-[92vw] max-w-xl rounded-lg bg-white p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Edit Social Post</h3>
                <button
                  className="px-2 py-1 text-sm rounded border hover:bg-gray-50"
                  onClick={() => setShowEditModal(false)}
                >
                  Close
                </button>
              </div>
              <form onSubmit={saveEdit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Platform
                  </label>
                  <select
                    className="w-full rounded border p-2 outline-none"
                    value={editPlatform}
                    onChange={(e) => setEditPlatform(e.target.value)}
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL</label>
                  <input
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    className="w-full rounded border p-2 outline-none"
                    placeholder="Paste the post or video URL"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Caption
                  </label>
                  <textarea
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    rows={4}
                    className="w-full rounded border p-2 outline-none"
                    placeholder="Write a caption"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 rounded border hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded bg-[#232652] text-white hover:opacity-90"
                  >
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <audio id="flip-audio" src="/flip.mp3" preload="auto" />
      </div>
    </>
  );
};

export default DiarySocialPage;
