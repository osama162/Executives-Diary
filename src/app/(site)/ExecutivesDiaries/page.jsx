"use client";

import { useEffect } from "react";
import React, { useState, useMemo } from "react";
import BookFlip from "../../components/BookFlip";
import { Menu, X } from "lucide-react";

const ExecutivesDiariesPage = () => {
  const [executives, setExecutives] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllIndustries, setShowAllIndustries] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const booksPerPage = 16;

  // Fetch executives from API
  useEffect(() => {
    const fetchExecutives = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/executives/`
        );
        const data = await response.json();
        if (response.ok) {
          const mapped = data.data.map((entry) => ({
            id: entry.id,
            coverImage: "/images/cover-ed2.png",
            profileImage: entry.picture || "/images/demoBookFlip.jpg",
            authorName: entry.first_name || entry.diary_title || "Unknown",
            industry: entry.industry || "Unknown",
            jobTitle: entry.job_title || "Unknown",
            first_name: entry.user_first_name || "Unknown",
            last_name: entry.user_last_name || "Unknown",
            href: `/executives/${
              entry.diary_title?.replace(/\s+/g, "-").toLowerCase() || entry.id
            }`,
          }));
          setExecutives(mapped);
        }
      } catch (error) {
        console.error("Error fetching executives:", error);
      }
    };

    fetchExecutives();
  }, []);

  const allIndustries = useMemo(() => {
    const unique = [...new Set(executives.map((e) => e.industry))];
    return unique.sort();
  }, [executives]);

  const displayedIndustries = showAllIndustries
    ? allIndustries
    : allIndustries.slice(0, 5);

  const filteredData = useMemo(() => {
    let filtered = executives;

    if (selectedIndustry !== "All") {
      filtered = filtered.filter((e) => e.industry === selectedIndustry);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (e) =>
          e.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [executives, selectedIndustry, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = filteredData.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedIndustry, searchTerm]);

  const handleIndustryChange = (industry) => {
    setSelectedIndustry(industry);
    setIsMobileMenuOpen(false); // Close mobile menu when industry is selected
  };
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoadMore = () => setShowAllIndustries(!showAllIndustries);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen py-4 sm:py-6 lg:py-10 px-2 sm:px-4 lg:px-20 w-full overflow-x-hidden">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 max-w-full">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-[400px] h-fit bg-white shadow-lg border border-gray-200 rounded-lg">
          <div className="border-b border-gray-200 px-6 py-8">
            <h2 className="text-3xl font-bold text-black text-center tracking-wider font-cinzel">
              INDUSTRIES
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {displayedIndustries.map((industry) => (
              <button
                key={industry}
                onClick={() => handleIndustryChange(industry)}
                className={`w-full text-center px-6 py-6 text-lg font-medium transition-colors duration-200 cursor-pointer ${
                  selectedIndustry === industry
                    ? "bg-[#40f7c049] text-gray-800 border-r-4 border-[#28d8a4]"
                    : "text-gray-800 hover:bg-[#40f7c049]"
                }`}
              >
                {industry}
              </button>
            ))}

            <div className="p-6">
              <button
                onClick={handleLoadMore}
                className="w-full bg-[#28d8a4] text-white px-4 py-3 rounded font-medium hover:bg-[#1ee4a9] transition-colors duration-200 cursor-pointer"
              >
                {showAllIndustries ? "Show Less" : "Load more"}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 overflow-hidden">
          {/* Mobile Industries Section */}
          <div className="lg:hidden mb-6">
            <div className="bg-white shadow-lg border border-gray-200 rounded-lg">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-bold text-black tracking-wider font-cinzel">
                    INDUSTRIES
                  </h2>
                  <button
                    onClick={toggleMobileMenu}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    aria-label="Toggle industries list"
                  >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
                </div>
              </div>

              {/* Mobile Industries List */}
              {isMobileMenuOpen && (
                <div className="divide-y divide-gray-200">
                  {displayedIndustries.map((industry) => (
                    <button
                      key={industry}
                      onClick={() => handleIndustryChange(industry)}
                      className={`w-full text-left px-6 py-4 text-lg font-medium transition-colors duration-200 cursor-pointer ${
                        selectedIndustry === industry
                          ? "bg-[#40f7c049] text-gray-800 border-r-4 border-[#28d8a4]"
                          : "text-gray-800 hover:bg-[#40f7c049]"
                      }`}
                    >
                      {industry}
                    </button>
                  ))}

                  <div className="p-6">
                    <button
                      onClick={handleLoadMore}
                      className="w-full bg-[#28d8a4] text-white px-4 py-3 rounded font-medium hover:bg-[#1ee4a9] transition-colors duration-200 cursor-pointer"
                    >
                      {showAllIndustries ? "Show Less" : "Load more"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Search Bar */}
          <div className="mb-6">
            <div className="w-full relative">
              <input
                type="text"
                placeholder="Search executives..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-3 pl-12 bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm sm:text-base"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Books Grid */}
          <div className="flex flex-wrap justify-center gap-0 mb-8 w-full overflow-hidden">
            {currentBooks.map((executive) => (
              <BookFlip key={executive.id} {...executive} />
            ))}
          </div>

          {/* No Results */}
          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No executives found matching your criteria.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 sm:px-4 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base"
              >
                Previous
              </button>

              <div className="flex flex-wrap gap-1 sm:gap-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-2 sm:px-4 rounded-lg transition-colors duration-200 text-sm sm:text-base ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 sm:px-4 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExecutivesDiariesPage;
