import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/layout/Navbar';
import { CATEGORIES } from '../data/mockCreators';
import { fetchCreators } from '../services/creatorsApi';
import CreatorSearch from '../components/CreatorSearch';
import CategoryFilter from '../components/CategoryFilter';
import CreatorGrid from '../components/CreatorGrid';
import HeroArtwork from '../components/HeroArtwork';

export default function CreatorListingPage() {
  const navigate = useNavigate();

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Relevance');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // 6 cards fit nicely in a 3-column responsive grid

  // API Data states
  const [creators, setCreators] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Debounce search input (350ms) to prevent excessive backend queries while typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 2. Reset pagination to page 1 whenever search keywords or domain category change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory]);

  // 3. Fetch creators from live PostgreSQL backend using creatorsApi service
  const loadCreators = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        page: currentPage,
        limit: pageSize,
      };

      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }

      const response = await fetchCreators(params);

      if (response && response.success && response.data) {
        setCreators(response.data.creators || []);
        setTotal(response.data.total ?? 0);
        setTotalPages(response.data.totalPages ?? 1);
      } else {
        throw new Error(response?.message || 'Failed to retrieve creators from database');
      }
    } catch (err) {
      console.error('Failed to load creators from live API:', err);
      setError(err);
      setCreators([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, selectedCategory, currentPage, pageSize]);

  useEffect(() => {
    loadCreators();
  }, [loadCreators]);

  // 4. Client-side sorting applied to currently fetched result set
  const sortedCreators = useMemo(() => {
    if (!creators || creators.length === 0) return [];
    const list = [...creators];

    if (sortBy === 'Name') {
      return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    if (sortBy === 'Experience') {
      return list.sort((a, b) => (b.experienceYears || 0) - (a.experienceYears || 0));
    }
    return list; // 'Relevance' / default order from database
  }, [creators, sortBy]);

  // Reset all filters and search input back to defaults
  const handleResetFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedCategory('All');
    setSortBy('Relevance');
    setCurrentPage(1);
  };

  // Immediate search submission (bypasses debounce on Enter or Search button click)
  const handleSearchSubmit = () => {
    setDebouncedSearch(searchTerm);
  };

  // Navigate to detailed profile using PostgreSQL UUID
  const handleViewProfile = (creator) => {
    if (creator && creator.id) {
      navigate(`/creators/${creator.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#192521] flex flex-col font-sans overflow-x-hidden w-full">
      {/* Top Navigation Bar with Mobile Drawer */}
      <Navbar />

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 flex-1">
        {/* Responsive Hero Section */}
        <section className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 md:gap-8 pb-6 sm:pb-8">
          <div className="max-w-2xl text-left z-10 w-full">
            {/* Subtle Eyebrow Label */}
            <div className="inline-flex items-center gap-2 mb-2 sm:mb-2.5">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#28634F] flex-shrink-0" />
              <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-[#5A6561]">
                Directory / Creator Discovery
              </span>
            </div>

            {/* Mobile-Optimized Editorial Serif Heading */}
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#192521] tracking-tight leading-tight sm:leading-[1.15]">
              Explore{' '}
              <span className="italic font-serif font-normal text-[#28634F]">
                Creators
              </span>{' '}
              &amp;{' '}
              <span className="italic font-serif font-normal text-[#28634F]">
                Practitioners
              </span>
            </h1>

            {/* Readable, balanced description */}
            <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm md:text-base text-[#5A6561] leading-relaxed max-w-xl font-normal">
              Discover vetted professionals, researchers, and domain leaders. Connect with practitioners working at the forefront of their fields.
            </p>
          </div>

          {/* Abstract Editorial Artwork */}
          <div className="hidden lg:flex w-full lg:w-auto justify-end flex-shrink-0">
            <HeroArtwork />
          </div>
        </section>

        {/* Search Bar Section */}
        <section className="mb-4 sm:mb-6 max-w-3xl">
          <CreatorSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onClear={() => {
              setSearchTerm('');
              setDebouncedSearch('');
            }}
            onSearchSubmit={handleSearchSubmit}
          />
        </section>

        {/* Category Filters Carousel */}
        <section className="mb-4 sm:mb-6">
          <CategoryFilter
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </section>

        {/* Responsive Metadata & Sort Controls */}
        <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-4 text-xs sm:text-sm text-[#5A6561] mb-5 sm:mb-6">
          <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-2">
            <span>
              {isLoading ? (
                <span>Loading practitioners...</span>
              ) : error ? (
                <span className="text-[#B84E3C]">Error loading creators</span>
              ) : (
                <>
                  Showing{' '}
                  <strong className="text-[#192521] font-semibold">
                    {sortedCreators.length}
                  </strong>{' '}
                  of {total} practitioners
                  {totalPages > 1 && (
                    <span className="text-[#5A6561]/80 ml-1">
                      (Page {currentPage} of {totalPages})
                    </span>
                  )}
                </>
              )}
            </span>

            {(searchTerm || selectedCategory !== 'All') && !isLoading && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[#28634F] hover:underline font-semibold underline-offset-2 ml-1 sm:ml-2 transition-colors cursor-pointer touch-manipulation"
              >
                Reset filters
              </button>
            )}
          </div>

          {/* Sort Selector with Comfortable Mobile Touch Target */}
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5E3DC]/60 gap-2">
            <label htmlFor="sort-select" className="text-xs font-medium text-[#5A6561] flex-shrink-0">
              Sort by:
            </label>
            <div className="relative">
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                disabled={isLoading || !!error}
                className="bg-white border border-[#E5E3DC] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#192521] shadow-sm focus:outline-none focus:ring-1 focus:ring-[#28634F] focus:border-[#28634F] cursor-pointer pr-7 appearance-none touch-manipulation min-h-[36px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="Relevance">Relevance</option>
                <option value="Experience">Experience (High to Low)</option>
                <option value="Name">Name (A-Z)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#5A6561]">
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Creator Cards Grid with Loading, Error, and Empty states */}
        <section>
          <CreatorGrid
            creators={sortedCreators}
            isLoading={isLoading}
            error={error}
            onRetry={loadCreators}
            onViewProfile={handleViewProfile}
            onResetFilters={handleResetFilters}
          />
        </section>

        {/* Pagination Controls */}
        {!isLoading && !error && totalPages > 1 && (
          <nav aria-label="Pagination" className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#E5E3DC]">
            <p className="text-xs sm:text-sm text-[#5A6561]">
              Showing page <strong className="text-[#192521] font-semibold">{currentPage}</strong> of{' '}
              <strong className="text-[#192521] font-semibold">{totalPages}</strong> ({total} total practitioners)
            </p>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-[#192521] bg-white border border-[#E5E3DC] rounded-xl hover:bg-[#EFECE3] disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                &larr; Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  style={pageNum === currentPage ? { backgroundColor: '#28634F', color: '#FFFFFF' } : {}}
                  className={`w-8 h-8 sm:w-9 sm:h-9 text-xs font-semibold rounded-xl transition-colors ${
                    pageNum === currentPage
                      ? 'bg-[#28634F] text-white shadow-sm'
                      : 'bg-white text-[#192521] border border-[#E5E3DC] hover:bg-[#EFECE3]'
                  }`}
                  aria-current={pageNum === currentPage ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-[#192521] bg-white border border-[#E5E3DC] rounded-xl hover:bg-[#EFECE3] disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                Next &rarr;
              </button>
            </div>
          </nav>
        )}
      </main>
    </div>
  );
}
