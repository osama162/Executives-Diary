'use client'

import { useEffect } from "react";
import React, { useState, useMemo } from 'react'
import BookFlip from '../../components/BookFlip'

const ExecutivesDiariesPage = () => {
  const [executives, setExecutives] = useState([])
  const [selectedIndustry, setSelectedIndustry] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAllIndustries, setShowAllIndustries] = useState(false)
  const booksPerPage = 16

  // Fetch executives from API
  useEffect(() => {
    const fetchExecutives = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/executives/`
        )
        const data = await response.json()
        if (response.ok) {
          const mapped = data.data.map(entry => ({
            id: entry.id,
            coverImage: '/images/cover-ed2.png',
            profileImage: entry.picture || '/images/demoBookFlip.jpg',
            authorName: entry.first_name || entry.diary_title || 'Unknown',
            industry: entry.industry || 'Unknown',
            jobTitle: entry.job_title || 'Unknown',
            first_name: entry.user_first_name || 'Unknown',
            last_name: entry.user_last_name || 'Unknown',
            href: `/executives/${entry.diary_title?.replace(/\s+/g, '-').toLowerCase() || entry.id}`,
          }))
          setExecutives(mapped)
        }
      } catch (error) {
        console.error('Error fetching executives:', error)
      }
    }

    fetchExecutives()
  }, [])

  const allIndustries = useMemo(() => {
    const unique = [...new Set(executives.map(e => e.industry))]
    return unique.sort()
  }, [executives])

  const displayedIndustries = showAllIndustries ? allIndustries : allIndustries.slice(0, 5)

  const filteredData = useMemo(() => {
    let filtered = executives

    if (selectedIndustry !== 'All') {
      filtered = filtered.filter(e => e.industry === selectedIndustry)
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(e =>
        e.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }, [executives, selectedIndustry, searchTerm])

  const totalPages = Math.ceil(filteredData.length / booksPerPage)
  const startIndex = (currentPage - 1) * booksPerPage
  const endIndex = startIndex + booksPerPage
  const currentBooks = filteredData.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedIndustry, searchTerm])

  const handleIndustryChange = (industry) => setSelectedIndustry(industry)
  const handleSearchChange = (e) => setSearchTerm(e.target.value)
  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLoadMore = () => setShowAllIndustries(!showAllIndustries)

  return (
    <div className="flex min-h-screen py-10 px-20 gap-3">
      {/* Sidebar */}
      <div className="w-[400px] h-fit bg-white shadow-lg border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200 px-6 py-8">
          <h2 className="text-3xl font-bold text-black text-center tracking-wider font-cinzel">
            INDUSTRIES
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {displayedIndustries.map(industry => (
            <button
              key={industry}
              onClick={() => handleIndustryChange(industry)}
              className={`w-full text-center px-6 py-6 text-lg font-medium transition-colors duration-200 cursor-pointer ${selectedIndustry === industry
                ? 'bg-[#40f7c049] text-gray-800 border-r-4 border-[#28d8a4]'
                : 'text-gray-800 hover:bg-[#40f7c049]'
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
              {showAllIndustries ? 'Show Less' : 'Load more'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="mb-0">
          <div className="max-w-[90%] mx-auto relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-3 pl-12 bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-0 mb-8">
          {currentBooks.map(executive => (
            <BookFlip
              key={executive.id}
              {...executive}
            />
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No executives found matching your criteria.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${currentPage === index + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExecutivesDiariesPage
