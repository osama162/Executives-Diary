"use client";
import React, { useCallback } from "react";
import { Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { FaFacebook, FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";

function openPopup(url) {
  // consistent centered popup for social share
  const w = 600, h = 520;
  const dualScreenLeft = window.screenLeft ?? window.screenX ?? 0;
  const dualScreenTop = window.screenTop ?? window.screenY ?? 0;
  const width = window.innerWidth ?? document.documentElement.clientWidth;
  const height = window.innerHeight ?? document.documentElement.clientHeight;
  const left = (width - w) / 2 + dualScreenLeft;
  const top = (height - h) / 2 + dualScreenTop;
  window.open(
    url,
    "_blank",
    `scrollbars=yes,resizable=yes,toolbar=0,location=0,status=0,menubar=0,width=${w},height=${h},top=${top},left=${left}`
  );
}

export default function ShareButtons({ url, title, description = "" }) {
  if (!url) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title || "");
  const encodedDesc = encodeURIComponent(description || "");

  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const tw = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const li = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  const onClick = useCallback((e, link) => {
    e.preventDefault();
    openPopup(link);
  }, []);

  return (
    <div className="flex items-center ">
      <span className="bg-[#353a3f] px-3 py-2 text-white text-lg font-bold flex items-center h-10">
        <Share2 className="w-5 h-5 mr-2" />
        Share Diary
      </span>

      <a
        href={fb}
        onClick={(e) => onClick(e, fb)}
        className="bg-[#3b5998] text-white p-4 flex items-center justify-center hover:bg-[#2d4373] transition-colors  h-10"
        aria-label="Share on Facebook"
      >
        <FaFacebookF className="w-4 h-4" />
      </a>

      <a
        href={tw}
        onClick={(e) => onClick(e, tw)}
        className="bg-[#1da1f2] text-white p-4 flex items-center justify-center hover:bg-[#1991db] transition-colors  h-10"
        aria-label="Share on X/Twitter"
      >
        <FaTwitter className="w-4 h-4" />
      </a>

      <a
        href={li}
        onClick={(e) => onClick(e, li)}
        className="bg-[#0077b5] text-white p-4 flex items-center justify-center hover:bg-[#046293] transition-colors  h-10"
        aria-label="Share on LinkedIn"
      >
        <FaLinkedinIn className="w-4 h-4" />
      </a>
    </div>
  );
}
