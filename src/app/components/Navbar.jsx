"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";


const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/ExecutivesDiaries", label: "EXECUTIVES DIARIES" },
  // { href: "/", label: "REVIEWS" },
  { href: "/About", label: "About" },
  // { href: "/", label: "BLOG" },
];



const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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

  return (
    <header
      className={[
        "sticky top-0 z-[1111] w-full transition-all duration-300",
        scrolled ? "bg-[#1e1c4d]/95 shadow-lg animate-slide-down-fade" : "bg-[#1e1c4d]",
      ].join(" ")}
    >
      <div className="mx-auto px-6 sm:px-6 lg:px-8 ">
        <div className="flex h-17 items-center justify-between">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            <button
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white lg:hidden"
            >
              <span className="sr-only">Open main menu</span>
              <div className="space-y-1.5">
                <span className="block h-0.5 w-6 bg-white" />
                <span className="block h-0.5 w-6 bg-white" />
                <span className="block h-0.5 w-6 bg-white" />
              </div>
            </button>

            {/* Logo */}
            <Link href="/" className="select-none text-white">
              <Image
                src={'/images/footer-logo.png'}
                width={500}
                height={500}
                className="w-[60%]"
                alt="logo"
              />
            </Link>
          </div>

          {/* Center: Nav (desktop) */}
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-14">
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

          {/* Right: Search + Login (desktop) */}
          <div className="hidden items-center gap-3 lg:flex">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search"
                className="h-9 w-full rounded-md border border-gray-300 bg-white pl-3 pr-9 text-sm text-slate-900 placeholder-slate-500 shadow-sm outline-none focus:ring-2 focus:ring-[#28d7a2]"
              />
              <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-gray-500"
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
              className="rounded-md bg-[#007bfd] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#1469dd] focus:outline-none focus:ring-2 focus:ring-white"
            >
              Login
            </Link>
          </div>


        </div>
      </div>

      {/* Mobile Drawer + Overlay */}
      <div
        className={[
          "fixed inset-0 z-[1112] lg:hidden transition-opacity",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      >
        {/* Overlay */}
        <div
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-black/50"
          aria-hidden="true"
        />

        {/* Drawer */}
        <aside
          className={[
            "absolute left-0 top-0 h-full w-80 max-w-[85%] translate-x-0 bg-[#1e1c4d] text-white shadow-2xl transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between px-4 py-4">
            <Link href="/" onClick={() => setOpen(false)} className="text-white">
              <div className="leading-none">
                <div className="text-xl font-extrabold tracking-wide">EXECUTIVES</div>
                <div className="-mt-1 text-sm font-extrabold tracking-widest">DIARY</div>
              </div>
            </Link>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="rounded-md p-2 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="px-4">
            <ul className="space-y-6">
              {NAV_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block text-base font-semibold uppercase tracking-wide text-white hover:text-[#28d7a2]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Search + Login in drawer */}
          <div className="mt-8 px-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="h-10 w-full rounded-md border border-gray-300 bg-white pl-3 pr-9 text-sm text-slate-900 placeholder-slate-500 shadow-sm outline-none focus:ring-2 focus:ring-[#28d7a2]"
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

            <Link
              href="/Login"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-[#1677ff] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#1469dd] focus:outline-none focus:ring-2 focus:ring-white"
            >
              Login
            </Link>
          </div>

        </aside>
      </div>
    </header>
  )
}

export default Navbar
