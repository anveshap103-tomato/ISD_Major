import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/layout/Navbar';
import { CREATOR_CATEGORIES } from '../constants/categories';
import { fetchCreators } from '../services/creatorsApi';
import { fetchUserConnections } from '../services/connectionsApi';
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
  const [retryCounter, setRetryCounter] = useState(0);
  const [connectionsData, setConnectionsData] = useState(null);

  // Fetch authenticated user's connections to synchronize card states
  useEffect(() => {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      fetchUserConnections()
        .then((res) => {
          if (res?.data) {
            setConnectionsData(res.data);
          }
        })
        .catch((err) => {
          console.warn('Could not load user connections on directory page:', err?.message);
        });
    }
  }, []);

  // 1. Debounce search input (350ms) and reset pagination to page 1 when search updates
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== debouncedSearch) {
        setDebouncedSearch(searchTerm);
        setCurrentPage(1);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearch]);

  // 2. Fetch creators from live PostgreSQL backend with stale-response protection
  useEffect(() => {
    let ignore = false;

    const executeFetch = async () => {
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

        if (!ignore) {
          if (response && response.success && response.data) {
            setCreators(response.data.creators || []);
            setTotal(response.data.total ?? 0);
            setTotalPages(response.data.totalPages ?? 1);
          } else {
            throw new Error(response?.message || 'Failed to retrieve creators from database');
          }
        }
      } catch (err) {
        if (!ignore) {
          console.error('Failed to load creators from live API:', err);
          setError(err);
          setCreators([]);
          setTotal(0);
          setTotalPages(1);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    executeFetch();

    return () => {
      ignore = true; // Stale-response protection: cancel effect when parameters change
    };
  }, [debouncedSearch, selectedCategory, currentPage, pageSize, retryCounter]);

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

  // Category change handler with immediate pagination reset
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // Immediate search submission (bypasses debounce on Enter or Search button click)
  const handleSearchSubmit = () => {
    setDebouncedSearch(searchTerm);
    setCurrentPage(1);
  };

  // Retry action to reload data with active parameters
  const handleRetry = () => {
    setRetryCounter((c) => c + 1);
  };

  // Navigate to detailed profile using PostgreSQL UUID
  const handleViewProfile = (creator) => {
    if (creator && creator.id) {
      navigate(`/creators/${creator.id}`);
    }
  };

  // Compact pagination items with ellipsis when totalPages > 5
  const paginationItems = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
    const sorted = Array.from(pages)
      .filter((p) => p >= 1 && p <= totalPages)
      .sort((a, b) => a - b);

    const items = [];
    sorted.forEach((p, idx) => {
      if (idx > 0 && p - sorted[idx - 1] > 1) {
        items.push(`ellipsis-${sorted[idx - 1]}-${p}`);
      }
      items.push(p);
    });
    return items;
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#192521] flex flex-col font-sans overflow-x-clip w-full">
      {/* Top Navigation Bar with Mobile Drawer */}
      <Navbar />

      {/* Main Container with Safe-Area Bottom Padding */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-10 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:pb-10 flex-1">
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
              setCurrentPage(1);
            }}
            onSearchSubmit={handleSearchSubmit}
          />
        </section>

        {/* Category Filters Carousel */}
        <section className="mb-4 sm:mb-6">
          <CategoryFilter
            categories={CREATOR_CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
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
                className="inline-flex items-center min-h-[44px] px-2.5 py-1.5 text-xs sm:text-sm text-[#28634F] hover:bg-[#EBF3EE] font-semibold underline underline-offset-2 ml-1 sm:ml-2 rounded-lg transition-colors cursor-pointer touch-manipulation focus:outline-none focus:ring-2 focus:ring-[#28634F]"
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
            <div className="relative flex items-center gap-1.5">
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                disabled={isLoading || !!error}
                className="bg-white border border-[#E5E3DC] rounded-xl px-3 py-2 text-xs font-semibold text-[#192521] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#28634F] focus:border-[#28634F] cursor-pointer pr-8 appearance-none touch-manipulation min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Sort practitioners on current page"
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
            {totalPages > 1 && sortBy !== 'Relevance' && (
              <span className="text-[11px] text-[#5A6561]/80 italic whitespace-nowrap">
                (Current page only)
              </span>
            )}
          </div>
        </section>

        {/* Creator Cards Grid with Loading, Error, and Empty states */}
        <section>
          <CreatorGrid
            creators={sortedCreators}
            isLoading={isLoading}
            error={error}
            onRetry={handleRetry}
            onViewProfile={handleViewProfile}
            onResetFilters={handleResetFilters}
            connectionsData={connectionsData}
          />
        </section>

        {/* Pagination Controls */}
        {!isLoading && !error && totalPages > 1 && (
          <nav aria-label="Pagination" className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#E5E3DC]">
            <p className="text-xs sm:text-sm text-[#5A6561]">
              Showing page <strong className="text-[#192521] font-semibold">{currentPage}</strong> of{' '}
              <strong className="text-[#192521] font-semibold">{totalPages}</strong> ({total} total practitioners)
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 w-full sm:w-auto">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="min-h-[44px] px-3.5 py-2 text-xs font-semibold text-[#192521] bg-white border border-[#E5E3DC] rounded-xl hover:bg-[#EFECE3] disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-[#28634F] cursor-pointer"
                aria-label="Previous page"
              >
                &larr; Prev
              </button>

              {paginationItems.map((item) => {
                if (typeof item === 'string') {
                  return (
                    <span
                      key={item}
                      className="min-w-[32px] min-h-[44px] inline-flex items-center justify-center text-xs font-semibold text-[#5A6561]"
                      aria-hidden="true"
                    >
                      &hellip;
                    </span>
                  );
                }
                const pageNum = item;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    style={pageNum === currentPage ? { backgroundColor: '#28634F', color: '#FFFFFF' } : {}}
                    className={`min-w-[44px] min-h-[44px] px-2 text-xs font-semibold rounded-xl transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-[#28634F] cursor-pointer ${
                      pageNum === currentPage
                        ? 'bg-[#28634F] text-white shadow-sm'
                        : 'bg-white text-[#192521] border border-[#E5E3DC] hover:bg-[#EFECE3]'
                    }`}
                    aria-current={pageNum === currentPage ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="min-h-[44px] px-3.5 py-2 text-xs font-semibold text-[#192521] bg-white border border-[#E5E3DC] rounded-xl hover:bg-[#EFECE3] disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-[#28634F] cursor-pointer"
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
