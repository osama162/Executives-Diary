"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
const Footer = () => {
  // for diary route retun null
  const pathname = usePathname();
  if (pathname.includes("/Diaries/Diary")) {
    return null;
  }
  return (
    <footer className="bg-[#1E1C4D] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center space-y-3">
          <p className="text-sm">
            © {new Date().getFullYear()} Executives Diary, All Rights Reserved
          </p>
          <div className="space-x-4 text-sm">
            <Link
              href="https://www.executivesdiary.com/privacy-policy"
              className="hover:underline text-gray-300 hover:text-white transition"
            >
              Privacy Policy
            </Link>
            <span className="text-gray-400">|</span>
            <Link
              href="https://www.executivesdiary.com/community-guidelines"
              className="hover:underline text-gray-300 hover:text-white transition"
            >
              Community Guidelines
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
