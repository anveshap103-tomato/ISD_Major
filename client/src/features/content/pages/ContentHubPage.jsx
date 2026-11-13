
import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/layout/Navbar';
import ContentCard from '../components/ContentCard';
import ContentFilters from '../components/ContentFilters';
import {
  fetchContent,
  fetchCategories,
  fetchBookmarks,
  addBookmark,
  removeBookmark,
} from '../services/contentApi';

export default function ContentHubPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('all');

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState(['All']);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookmarkError, setBookmarkError] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await fetchCategories();
        setCategories(['All', ...(result.items || []).map((item) => item.name)]);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      setError('');

      try {
        const result = await fetchContent({
          search: search.trim() || undefined,
          page,
          category: selectedCategory === 'All' ? undefined : selectedCategory,
          type: selectedType === 'all' ? undefined : selectedType,
        });

        setItems(result.items || []);
        setTotalPages(result.totalPages || 1);
        setTotalCount(result.total || 0);
      } catch (err) {
        console.error('Failed to load content:', err);
        setError('Could not load resources. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [search, selectedCategory, selectedType, page]);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const result = await fetchBookmarks();
        setBookmarkedIds(
          (Array.isArray(result) ? result : []).map((bookmark) => bookmark.contentId)
        );
      } catch (err) {
        console.error('Failed to load bookmarks:', err);
      }
    };

    loadBookmarks();
  }, []);

  const toggleBookmark = async (contentId) => {
    setBookmarkError('');

    const alreadyBookmarked = bookmarkedIds.includes(contentId);

    try {
      if (alreadyBookmarked) {
        await removeBookmark(contentId);
        setBookmarkedIds((current) =>
          current.filter((id) => id !== contentId)
        );
      } else {
        await addBookmark(contentId);
        setBookmarkedIds((current) => [...current, contentId]);
      }
    } catch (err) {
      console.error('Bookmark update failed:', err);
      setBookmarkError('Could not update bookmark. Please try again.');
    }
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
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={(value) => {
  setSelectedCategory(value);
  setPage(1);
}}
          selectedType={selectedType}
          onTypeChange={(value) => {
  setSelectedType(value);
  setPage(1);
}}
          search={search}
          onSearchChange={(value) => {
  setSearch(value);
  setPage(1);
}}
        />

        <div className="mb-4 mt-7 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold">Explore resources</h2>
          <p className="text-xs text-[#707A75]">
            {totalCount} resources
          </p>
        </div>

        {bookmarkError && (
          <p className="mb-4 text-sm text-red-600">{bookmarkError}</p>
        )}

        {loading ? (
          <p className="py-12 text-center text-sm text-[#707A75]">
            Loading resources...
          </p>
        ) : error ? (
          <p className="py-12 text-center text-sm text-red-600">{error}</p>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
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
            <p className="font-serif text-lg font-semibold">
              No resources match those filters.
            </p>
            <p className="mt-2 text-sm text-[#707A75]">
              Try another search or choose a different category.
            </p>
          </div>
        )}
              {!loading && !error && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => setPage((current) => current - 1)}
              disabled={page === 1}
              className="rounded-lg border border-[#D8DED8] bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm text-[#707A75]">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((current) => current + 1)}
              disabled={page === totalPages}
              className="rounded-lg bg-[#28634F] px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
