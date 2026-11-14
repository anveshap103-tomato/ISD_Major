
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
  const [categories, setCategories] = useState(['All']);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoriesError, setCategoriesError] = useState('');
  const [bookmarksError, setBookmarksError] = useState('');
  const [bookmarksLoading, setBookmarksLoading] = useState(true);
  const [pendingBookmarkIds, setPendingBookmarkIds] = useState([]);

  const [retryContent, setRetryContent] = useState(0);
  const [retryCategories, setRetryCategories] = useState(0);
  const [retryBookmarks, setRetryBookmarks] = useState(0);

  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesError('');

      try {
        const result = await fetchCategories();
        setCategories([
          'All',
          ...(result.items || []).map((item) => item.name),
        ]);
      } catch (err) {
        console.error('Failed to load categories:', err);
        setCategoriesError('Could not load categories. Please try again.');
      }
    };

    loadCategories();
  }, [retryCategories]);

  useEffect(() => {
    const controller = new AbortController();
    let isCurrentRequest = true;

    const loadContent = async () => {
      setLoading(true);
      setError('');

      try {
        const result = await fetchContent({
          search: search.trim() || undefined,
          category: selectedCategory === 'All' ? undefined : selectedCategory,
          type: selectedType === 'all' ? undefined : selectedType,
          page,
        }, { signal: controller.signal });

        if (!isCurrentRequest) return;
        setItems(result.items || []);
        setTotalPages(result.totalPages || 1);
        setTotalCount(result.total || 0);
      } catch (err) {
        if (!isCurrentRequest || controller.signal.aborted) return;
        console.error('Failed to load content:', err);
        setError('Could not load resources. Please try again.');
      } finally {
        if (isCurrentRequest) setLoading(false);
      }
    };

    loadContent();

    return () => {
      isCurrentRequest = false;
      controller.abort();
    };
  }, [search, selectedCategory, selectedType, page, retryContent]);

  useEffect(() => {
    const loadBookmarks = async () => {
      setBookmarksLoading(true);
      setBookmarksError('');

      try {
        const result = await fetchBookmarks();

        setBookmarkedIds(
          (Array.isArray(result) ? result : [])
            .map((bookmark) => bookmark.contentId || bookmark.content?.id)
            .filter(Boolean)
        );
      } catch (err) {
        console.error('Failed to load bookmarks:', err);
        setBookmarksError('Could not load your saved resources. Please try again.');
      } finally {
        setBookmarksLoading(false);
      }
    };

    loadBookmarks();
  }, [retryBookmarks]);

  const toggleBookmark = async (contentId) => {
    if (
      pendingBookmarkIds.includes(contentId) ||
      bookmarksLoading
    ) {
      return;
    }

    const isBookmarked = bookmarkedIds.includes(contentId);

    setPendingBookmarkIds((current) => [...current, contentId]);
    setBookmarksError('');

    try {
      if (isBookmarked) {
        await removeBookmark(contentId);
        setBookmarkedIds((current) =>
          current.filter((id) => id !== contentId)
        );
      } else {
        await addBookmark(contentId);
        setBookmarkedIds((current) =>
          [...new Set([...current, contentId])]
        );
      }
    } catch (err) {
      console.error('Bookmark update failed:', err);
      setBookmarksError('Could not update this saved resource. Please try again.');
    } finally {
      setPendingBookmarkIds((current) =>
        current.filter((id) => id !== contentId)
      );
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

        {categoriesError && (
          <div className="mt-3 flex items-center gap-3 text-sm text-[#9B3D32]" role="alert">
            <span>{categoriesError}</span>
            <button
              type="button"
              onClick={() => setRetryCategories((attempt) => attempt + 1)}
              className="font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {bookmarksError && (
          <div className="mt-3 flex items-center gap-3 text-sm text-[#9B3D32]" role="alert">
            <span>{bookmarksError}</span>
            <button
              type="button"
              onClick={() => setRetryBookmarks((attempt) => attempt + 1)}
              className="font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="mb-4 mt-7 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold">
            Explore resources
          </h2>
          <p className="text-xs text-[#707A75]">
            {totalCount} resources
          </p>
        </div>

        {loading ? (
          <p className="py-12 text-center text-sm text-[#707A75]" role="status">
            Loading resources...
          </p>
        ) : error ? (
          <div className="rounded-2xl border border-dashed border-[#C9D0C9] bg-white/70 px-6 py-12 text-center" role="alert">
            <p className="font-serif text-lg font-semibold">{error}</p>
            <button
              type="button"
              onClick={() => setRetryContent((attempt) => attempt + 1)}
              className="mt-3 rounded-lg bg-[#28634F] px-4 py-2 text-sm font-semibold text-white"
            >
              Retry
            </button>
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                isBookmarked={bookmarkedIds.includes(item.id)}
                onToggleBookmark={toggleBookmark}
                isBookmarking={
                  bookmarksLoading || pendingBookmarkIds.includes(item.id)
                }
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
