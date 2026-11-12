import React, { useMemo, useState } from 'react';
import Navbar from '../../../components/layout/Navbar';
import ContentCard from '../components/ContentCard';
import ContentFilters from '../components/ContentFilters';
import { CONTENT_CATEGORIES, MOCK_CONTENT } from '../data/mockContent';

export default function ContentHubPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('all');
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return MOCK_CONTENT.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesType = selectedType === 'all' || item.type === selectedType;
      const matchesSearch =
        !query ||
        [item.title, item.description, item.author, item.category, item.type]
          .some((value) => value.toLowerCase().includes(query));

      return matchesCategory && matchesType && matchesSearch;
    });
  }, [search, selectedCategory, selectedType]);

  const toggleBookmark = (contentId) => {
    setBookmarkedIds((current) =>
      current.includes(contentId)
        ? current.filter((id) => id !== contentId)
        : [...current, contentId]
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#192521]">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className="mb-8 max-w-3xl">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#28634F]">
            Knowledge Hub
          </p>
          <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            Learn something worth sharing.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#5A6561] sm:text-base">
            Explore useful articles, videos, and books picked to help you move from curiosity to action.
          </p>
        </section>

        <ContentFilters
          categories={CONTENT_CATEGORIES}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          search={search}
          onSearchChange={setSearch}
        />

        <div className="mb-4 mt-7 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold">Explore resources</h2>
          <p className="text-xs text-[#707A75]">{visibleItems.length} resources</p>
        </div>

        {visibleItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleItems.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                isBookmarked={bookmarkedIds.includes(item.id)}
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#C9D0C9] bg-white/70 px-6 py-12 text-center">
            <p className="font-serif text-lg font-semibold">No resources match those filters.</p>
            <p className="mt-2 text-sm text-[#707A75]">Try another search or choose a different category.</p>
          </div>
        )}
      </main>
    </div>
  );
}
