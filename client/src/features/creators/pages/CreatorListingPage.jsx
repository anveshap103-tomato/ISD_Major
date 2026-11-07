import React, { useState, useMemo } from 'react';
import Navbar from '../../../components/layout/Navbar';
import { MOCK_CREATORS, CATEGORIES } from '../data/mockCreators';
import CreatorSearch from '../components/CreatorSearch';
import CategoryFilter from '../components/CategoryFilter';
import CreatorGrid from '../components/CreatorGrid';
import HeroArtwork from '../components/HeroArtwork';

export default function CreatorListingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Relevance');

  // Filter and sort creators based on search query, category, and sort option
  const filteredCreators = useMemo(() => {
    let result = MOCK_CREATORS.filter((creator) => {
      // Category filter
      const matchesCategory =
        selectedCategory === 'All' || creator.category === selectedCategory;

      // Search query
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        creator.name.toLowerCase().includes(query) ||
        creator.role.toLowerCase().includes(query) ||
        creator.company.toLowerCase().includes(query) ||
        creator.bio.toLowerCase().includes(query) ||
        creator.skills.some((skill) => skill.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });

    // Sorting
    if (sortBy === 'Name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'Experience') {
      result = [...result].sort((a, b) => b.experienceYears - a.experienceYears);
    }

    return result;
  }, [searchTerm, selectedCategory, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortBy('Relevance');
  };

  const handleViewProfile = (creator) => {
    alert(`Viewing profile for ${creator.name} (${creator.role} @ ${creator.company})`);
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

          {/* Abstract Editorial Artwork (hidden on mobile & tablet to preserve clean space) */}
          <div className="hidden lg:flex w-full lg:w-auto justify-end flex-shrink-0">
            <HeroArtwork />
          </div>
        </section>

        {/* Search Bar Section */}
        <section className="mb-4 sm:mb-6 max-w-3xl">
          <CreatorSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onClear={() => setSearchTerm('')}
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
              Showing{' '}
              <strong className="text-[#192521] font-semibold">
                {filteredCreators.length}
              </strong>{' '}
              of {MOCK_CREATORS.length} practitioners
            </span>
            {(searchTerm || selectedCategory !== 'All') && (
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
                className="bg-white border border-[#E5E3DC] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#192521] shadow-sm focus:outline-none focus:ring-1 focus:ring-[#28634F] focus:border-[#28634F] cursor-pointer pr-7 appearance-none touch-manipulation min-h-[36px]"
              >
                <option value="Relevance">Relevance</option>
                <option value="Experience">Experience</option>
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

        {/* Creator Cards Grid (1-col mobile, 2-col tablet, 3-col desktop) */}
        <section>
          <CreatorGrid
            creators={filteredCreators}
            onViewProfile={handleViewProfile}
            onResetFilters={handleResetFilters}
          />
        </section>
      </main>
    </div>
  );
}
