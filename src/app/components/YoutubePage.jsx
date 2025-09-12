import React, { useMemo } from "react";

const extractYouTubeId = (url = "") => {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const parts = u.pathname.split("/");
    const idx = parts.findIndex((s) => s === "embed" || s === "shorts");
    if (idx !== -1 && parts[idx + 1]) return parts[idx + 1];
  } catch {}
  return null;
};

const YoutubePage = ({ className = "", post, onEdit, onDelete, saving }) => {
  const caption = post?.caption || "My First Attempt At Vlogging...";
  const url = post?.url || "https://www.youtube.com/watch?v=XPmUayPd5FA";
  const platform = post?.platform || "YouTube";

  const ytId = useMemo(
    () => (platform === "YouTube" ? extractYouTubeId(url) : null),
    [platform, url]
  );

  return (
    <div className={`w-full h-full flex flex-col ${className}`}>
      {/* Header with title and action buttons (same design) */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold capitalize">Youtube</h2>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="
              inline-flex items-center px-3 py-1.5 text-sm font-bold cursor-pointer
              border rounded-none transition-colors
              bg-[#ffc107] text-[#212529] border-[#ffc107]
              hover:bg-[#e0a800] hover:border-[#e0a800]
            "
            disabled={!post || saving}
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit Post
          </button>

          <button
            onClick={onDelete}
            className="inline-flex items-center px-3 py-1.5 text-sm bg-red-500 text-white  hover:bg-red-600 transition-colors cursor-pointer border border-red-600 rounded-none"
            disabled={!post || saving}
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* Main title (same design) */}
      <h4 className="text-2xl font-semibold font-muli text-gray-900 mb-4 leading-normal">
        {caption}
      </h4>

      {/* Video / Fallback (same block) */}
      {platform === "YouTube" && ytId ? (
        <div className="relative aspect-video w-full overflow-hidden">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${ytId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Message from Executives Diary founder"
          />
        </div>
      ) : (
        <div className="text-sm text-gray-600">
          {url ? (
            <>
              Preview not available for <b>{platform}</b>.{" "}
              <a className="underline text-blue-600" href={url} target="_blank" rel="noreferrer">
                Open link
              </a>
            </>
          ) : (
            "No URL provided."
          )}
        </div>
      )}
    </div>
  );
};

export default YoutubePage;
