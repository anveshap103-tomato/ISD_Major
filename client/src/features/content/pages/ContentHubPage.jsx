import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/layout/Navbar';
import api from '../../../services/api';
import ContentCard from '../components/ContentCard';
import ContentFilters from '../components/ContentFilters';
import {
  addContentBookmark,
  fetchContentBookmarks,
  removeContentBookmark,
} from '../services/contentApi';

export default function ContentHubPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('all');
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [pendingBookmarkIds, setPendingBookmarkIds] = useState([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(true);
  const [bookmarksError, setBookmarksError] = useState('');
  const [retryBookmarks, setRetryBookmarks] = useState(0);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoriesError, setCategoriesError] = useState('');
  const [retryContent, setRetryContent] = useState(0);
  const [retryCategories, setRetryCategories] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadCategories = async () => {
      setCategoriesError('');
      try {
        const response = await api.get('/content/categories', { signal: controller.signal });
        const categoryItems = response.data?.data?.items;
        setCategories(Array.isArray(categoryItems) ? categoryItems : []);
      } catch (requestError) {
        if (requestError.code === 'ERR_CANCELED') return;
        setCategoriesError('Could not load categories. Please try again.');
      }
    };

    loadCategories();
    return () => controller.abort();
  }, [retryCategories]);

  useEffect(() => {
    const controller = new AbortController();

    const loadBookmarks = async () => {
      setBookmarksLoading(true);
      setBookmarksError('');
      try {
        const bookmarks = await fetchContentBookmarks({ signal: controller.signal });
        setBookmarkedIds(
          bookmarks
            .map((bookmark) => bookmark.contentId || bookmark.content?.id)
            .filter(Boolean)
        );
      } catch (requestError) {
        if (requestError.code === 'ERR_CANCELED') return;
        setBookmarksError('Could not load your saved resources. Please try again.');
      } finally {
        if (!controller.signal.aborted) setBookmarksLoading(false);
      }
    };

    loadBookmarks();
    return () => controller.abort();
  }, [retryBookmarks]);

  useEffect(() => {
    const controller = new AbortController();

    const loadContent = async () => {
      setLoading(true);
      setError('');

      const params = { page: 1, limit: 50 };
      if (search.trim()) params.search = search.trim();
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedType !== 'all') params.type = selectedType;

      try {
        const response = await api.get('/content', { params, signal: controller.signal });
        const result = response.data?.data;
        setItems(Array.isArray(result?.items) ? result.items : []);
        setTotal(Number.isFinite(result?.total) ? result.total : 0);
      } catch (requestError) {
        if (requestError.code === 'ERR_CANCELED') return;
        setItems([]);
        setTotal(0);
        setError('Could not load resources. Check your connection and try again.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadContent();
    return () => controller.abort();
  }, [search, selectedCategory, selectedType, retryContent]);

  const toggleBookmark = async (contentId) => {
    if (pendingBookmarkIds.includes(contentId) || bookmarksLoading) return;

    const isBookmarked = bookmarkedIds.includes(contentId);
    setPendingBookmarkIds((current) => [...current, contentId]);
    setBookmarksError('');

    try {
      if (isBookmarked) {
        await removeContentBookmark(contentId);
        setBookmarkedIds((current) => current.filter((id) => id !== contentId));
      } else {
        await addContentBookmark(contentId);
        setBookmarkedIds((current) => [...new Set([...current, contentId])]);
      }
    } catch (requestError) {
      if (requestError.response?.status === 409 && !isBookmarked) {
        setBookmarkedIds((current) => [...new Set([...current, contentId])]);
      } else if (requestError.response?.status === 404 && isBookmarked) {
        setBookmarkedIds((current) => current.filter((id) => id !== contentId));
      } else {
        setBookmarksError('Could not update this saved resource. Please try again.');
      }
    } finally {
      setPendingBookmarkIds((current) => current.filter((id) => id !== contentId));
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
          categories={['All', ...categories.map((category) => category.name)]}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          search={search}
          onSearchChange={setSearch}
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
          <h2 className="font-serif text-xl font-semibold">Explore resources</h2>
          <p className="text-xs text-[#707A75]">{total} resources</p>
        </div>

        {loading ? (
          <p className="py-12 text-center text-sm text-[#707A75]" role="status">
            Loading resources…
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
                isBookmarking={bookmarksLoading || pendingBookmarkIds.includes(item.id)}
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
