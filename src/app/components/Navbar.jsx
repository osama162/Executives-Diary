"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/ExecutivesDiaries", label: "EXECUTIVES DIARIES" },
  { href: "/", label: "REVIEWS" },
  { href: "/About", label: "About" },
  { href: "/", label: "Blog" },

  // { href: "/", label: "REVIEWS" },
  // { href: "/", label: "BLOG" },
];

const INDUSTRIES = [
  { name: "Consultant", subcategories: [] },
  {
    name: "Technology",
    subcategories: ["Computer Technologies"],
  },
  { name: "Marketing", subcategories: [] },
  { name: "Leadership", subcategories: [] },
  { name: "Business", subcategories: [] },
  { name: "Finance", subcategories: [] },
  { name: "Education", subcategories: [] },
  {
    name: "Media and Advertising",
    subcategories: ["Entertainment"],
  },
  {
    name: "Health Care",
    subcategories: [],
  },
  { name: "Management Consulting", subcategories: [] },
  { name: "Energy", subcategories: [] },
  { name: "Law", subcategories: [] },
  { name: "Human Resource", subcategories: [] },
  { name: "Fashion", subcategories: [] },
  { name: "Real Estate", subcategories: [] },
  { name: "Public Safety", subcategories: [] },
  { name: "Cosmetics", subcategories: [] },
  { name: "Business Advisor", subcategories: [] },
  { name: "Architecture & Planning", subcategories: [] },
  { name: "Industrial", subcategories: [] },
  { name: "Environment", subcategories: [] },
  { name: "Writing and Editing", subcategories: [] },
  { name: "Food", subcategories: [] },
  { name: "Hospitality", subcategories: [] },
  { name: "Journalism", subcategories: [] },
  { name: "Transportation & Logistic", subcategories: [] },
  { name: "Community Building", subcategories: [] },
  { name: "Project Management", subcategories: [] },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [leftOpen, setLeftOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const [openSubcategories, setOpenSubcategories] = useState({});
  const lastY = useRef(0);
  const pathname = usePathname();
  // Toggle functions
  const toggleIndustries = () => {
    setIndustriesOpen(!industriesOpen);
  };

  const toggleSubcategory = (industryName) => {
    setOpenSubcategories((prev) => ({
      ...prev,
      [industryName]: !prev[industryName],
    }));
  };

  // Lock body scroll when drawer open
  useEffect(() => {
    if (open || leftOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, leftOpen]);

  // Add sticky + transition on scroll
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      setScrolled(y > 8);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // for diary route retun null
  if (pathname.includes("/Diaries/Diary")) {
    return null;
  }

  return (
    <>
      <style jsx>{`
        #leftModal .active {
          background: #ffffff42;
        }
        #leftModal .nav-link {
          display: block;
        }
        .sub-menu ul li a {
          padding-left: 12px;
          padding-left: 37px;
        }
        .nav-link {
          color: #fff !important;
          font: 600 13px / 39px Muli, sans-serif !important;
          display: inline-block;
        }
        .nav-link {
          display: block;
          padding: 0.5rem 1rem;
        }
      `}</style>
      <header
        className={[
          "sticky top-0 z-[1111] w-full transition-all duration-300",
          scrolled
            ? "bg-[#1e1c4d]/95 shadow-lg animate-slide-down-fade"
            : "bg-[#1e1c4d]",
        ].join(" ")}
      >
        <div className="mx-auto py-2 px-4 sm:px-4 lg:px-4 ">
          <div className="flex h-17 items-center justify-between">
            {/* Left: Left Hamburger + Logo */}
            <div className="flex items-center gap-3">
              {/* Left Hamburger - Industries Menu */}
              <button
                aria-label="Open industries menu"
                onClick={() => setLeftOpen(true)}
                className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <span className="sr-only">Open industries menu</span>
                <div className="space-y-1.5">
                  <span className="block h-0.5 w-6 bg-white" />
                  <span className="block h-0.5 w-6 bg-white" />
                  <span className="block h-0.5 w-6 bg-white" />
                </div>
              </button>

              {/* Logo */}
              <Link href="/" className="select-none text-white">
                <Image
                  src={"/images/footer-logo.png"}
                  width={160}
                  height={40}
                  // className="w-[60%]"
                  alt="logo"
                />
              </Link>
            </div>

            {/* Center: Nav (desktop) */}
            <nav className="hidden lg:block">
              <ul className="flex items-center gap-[45px]">
                {NAV_LINKS.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm uppercase font-semibold leading-[70px] text-white transition-colors hover:text-[#28d7a2]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right: Search + Login (desktop) + Mobile Burger */}
            <div className="flex items-center gap-3">
              {/* Desktop Search + Login */}
              <div className="hidden items-center gap-3 lg:flex">
                <div className="relative w-[165px] h-[40px]">
                  <input
                    type="text"
                    placeholder="Search"
                    className="h-[40px] w-full bg-[#eaeaef] pl-3 pr-9 text-sm text-slate-900 placeholder-slate-500 placeholder:text-base shadow-sm outline-none focus:ring-2 focus:ring-[#28d7a2]"
                  />
                  <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </span>
                </div>

                <Link
                  href="/Login"
                  className="rounded-md bg-[#007bfd] px-[12px] py-[8px] text-base font-semibold text-white shadow hover:bg-[#1469dd] focus:outline-none focus:ring-2 focus:ring-white"
                >
                  Login
                </Link>
              </div>

              {/* Right Hamburger - Mobile Menu */}
              <button
                aria-label="Open main menu"
                onClick={() => setOpen(!open)}
                className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white lg:hidden"
              >
                <span className="sr-only">Open main menu</span>
                <div className="space-y-1.5">
                  <span className="block h-0.5 w-6 bg-white" />
                  <span className="block h-0.5 w-6 bg-white" />
                  <span className="block h-0.5 w-6 bg-white" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Full Width Below Navbar */}
        <div
          className={[
            "fixed top-[73px] left-0 right-0 z-[1112] lg:hidden transition-all duration-300 ease-in-out",
            open
              ? "pointer-events-auto opacity-100 translate-y-0"
              : "pointer-events-none opacity-0 -translate-y-4",
          ].join(" ")}
        >
          {/* Mobile Menu Content */}
          <div
            className="w-full bg-[#1e1c4d] text-white shadow-2xl"
            role="dialog"
            aria-modal="true"
          >
            {/* Mobile Menu Content */}
            <div className="px-4 py-6">
              {/* Navigation Links - Left Side */}
              <nav className="mb-6">
                <ul className="space-y-4">
                  {NAV_LINKS.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="block text-base font-semibold uppercase tracking-wide text-white hover:text-[#28d7a2] transition-colors duration-200 py-2"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Search and Login - Right Side Layout */}
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                {/* Search Input - Same as Desktop */}
                <div className="relative flex-1 sm:max-w-[165px]">
                  <input
                    type="text"
                    placeholder="Search"
                    className="h-[40px] w-full bg-[#eaeaef] pl-3 pr-9 text-sm text-slate-900 placeholder-slate-500 placeholder:text-base shadow-sm outline-none focus:ring-2 focus:ring-[#28d7a2] transition-all duration-200"
                  />
                  <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </span>
                </div>

                {/* Login Button - Same as Desktop */}
                <Link
                  href="/Login"
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-[#007bfd] px-[12px] py-[8px] text-base font-semibold text-white shadow hover:bg-[#1469dd] focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200 text-center sm:w-auto"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Left Industries Modal + Overlay */}
        <div
          className={[
            "fixed inset-0 z-[1113] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
            leftOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0",
          ].join(" ")}
        >
          {/* Overlay */}
          <div
            onClick={() => setLeftOpen(false)}
            className="absolute inset-0 bg-black/50"
            aria-hidden="true"
          />

          {/* Left Industries Drawer */}
          <aside
            id="leftModal"
            className={[
              "absolute left-0 top-0 h-full w-80 max-w-[85%] translate-x-0 bg-[#1e1c4d] text-white shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col",
              leftOpen
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0",
            ].join(" ")}
            role="dialog"
            aria-modal="true"
          >
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
              {/* Home Header with Cross Icon */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/20">
                <h2 className="text-lg font-bold text-white">Home</h2>
                <button
                  onClick={() => setLeftOpen(false)}
                  aria-label="Close industries menu"
                  className="rounded-md p-2 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-6 w-6"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* All Industries Header */}
              <div
                className="px-4 py-3 border-b border-white/20 cursor-pointer hover:bg-white/10 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                onClick={toggleIndustries}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">
                    All Industries
                  </h3>
                  <svg
                    className={`w-5 h-5 text-white transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                      industriesOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Industries List */}
              <nav
                className={`px-0 py-2 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  industriesOpen
                    ? "max-h-screen opacity-100"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                <ul className="space-y-0">
                  {INDUSTRIES.map((industry, index) => (
                    <li key={index} className="border-b border-white/20">
                      {/* Main Category Row */}
                      <div
                        className={`group hover:bg-white/20 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                          industry.subcategories.length > 0 &&
                          openSubcategories[industry.name]
                            ? "bg-white/20"
                            : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Link
                            href={`/industry/${industry.name
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                            onClick={() => setLeftOpen(false)}
                            className="nav-link flex-1 block px-4 py-2 text-white transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                            style={{
                              font: "600 13px / 39px Muli, sans-serif",
                              paddingLeft: "37px",
                            }}
                          >
                            {industry.name}
                          </Link>
                          {industry.subcategories.length > 0 && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                toggleSubcategory(industry.name);
                              }}
                              className="px-2 py-2 text-white transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                            >
                              <svg
                                className={`w-4 h-4 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                                  openSubcategories[industry.name]
                                    ? "rotate-180"
                                    : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Subcategories */}
                      {industry.subcategories.length > 0 && (
                        <div
                          className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                            openSubcategories[industry.name]
                              ? "max-h-screen opacity-100"
                              : "max-h-0 opacity-0 overflow-hidden"
                          }`}
                        >
                          <ul className="space-y-0">
                            {industry.subcategories.map(
                              (subcategory, subIndex) => (
                                <li
                                  key={subIndex}
                                  className="border-b border-white/10"
                                >
                                  <Link
                                    href={`/industry/${subcategory
                                      .toLowerCase()
                                      .replace(/\s+/g, "-")}`}
                                    onClick={() => setLeftOpen(false)}
                                    className="nav-link block px-4 py-2 text-white hover:bg-white/20 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                                    style={{
                                      font: "600 13px / 39px Muli, sans-serif",
                                      paddingLeft: "60px",
                                    }}
                                  >
                                    {subcategory}
                                  </Link>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>
        </div>
      </header>
    </>
  );
};

export default Navbar;
