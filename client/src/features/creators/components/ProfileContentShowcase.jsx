import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { openExternalUrl } from '../utils/externalLink.js';

const CONTENT_TYPE_CONFIG = {
  ARTICLE: {
    label: 'Article',
    badgeClass: 'bg-[#DCE8E0] text-[#28634F]',
  },
  VIDEO: {
    label: 'Video',
    badgeClass: 'bg-[#F9EDE0] text-[#B87A36]',
  },
  BOOK: {
    label: 'Book',
    badgeClass: 'bg-[#EAF1F8] text-[#346585]',
  },
  RESOURCE: {
    label: 'Resource',
    badgeClass: 'bg-[#EDEBE4] text-[#5A6561]',
  },
};

const normalizeContentType = (type) => {
  if (typeof type !== 'string') return 'RESOURCE';
  const upper = type.trim().toUpperCase();
  return CONTENT_TYPE_CONFIG[upper] ? upper : 'RESOURCE';
};

const formatPublishedDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return typeof value === 'string' ? value : null;
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);
};

const resolveContentNavigation = (item) => {
  const url = typeof item?.url === 'string' ? item.url.trim() : '';
  if (!url) return { kind: 'none', href: null };
  if (/^https?:\/\//i.test(url)) return { kind: 'external', href: url };
  if (url.startsWith('/')) return { kind: 'internal', href: url };
  return { kind: 'none', href: null };
};

function ContentTypeIcon({ type }) {
  if (type === 'VIDEO') {
    return (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    );
  }
  if (type === 'BOOK') {
    return (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    );
  }
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function ContentItemCard({ item }) {
  const [thumbnailFailed, setThumbnailFailed] = useState(false);

  const normalizedType = normalizeContentType(item.type);
  const typeConfig = CONTENT_TYPE_CONFIG[normalizedType];
  const thumbnailUrl = !thumbnailFailed
    ? (item.thumbnail || item.thumbnailUrl || item.imageUrl || '')
    : '';
  const categoryName = typeof item.category === 'string'
    ? item.category
    : (item.category?.name || '');
  const formattedDate = formatPublishedDate(item.publishedAt || item.createdAt);
  const navigation = resolveContentNavigation(item);

  const cardContent = (
    <>
      <div>
        {thumbnailUrl && (
          <div className="mb-3 overflow-hidden rounded-lg border border-[#E5E3DC] bg-[#EDEBE4] aspect-[16/9]">
            <img
              src={thumbnailUrl}
              alt={item.title || 'Resource thumbnail'}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
              onError={() => setThumbnailFailed(true)}
            />
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${typeConfig.badgeClass}`}>
              <ContentTypeIcon type={normalizedType} />
              <span>{typeConfig.label}</span>
            </span>
            {categoryName && (
              <span className="text-[11px] font-medium text-[#5A6561] truncate max-w-[130px]">
                {categoryName}
              </span>
            )}
          </div>

          {formattedDate && (
            <span className="text-[11px] text-[#5A6561] flex-shrink-0">
              {formattedDate}
            </span>
          )}
        </div>

        <h3 className="font-serif text-sm sm:text-base font-bold text-[#192521] group-hover:text-[#28634F] transition-colors leading-snug">
          {item.title}
        </h3>

        {item.description && (
          <p className="mt-1.5 text-xs text-[#5A6561] leading-relaxed line-clamp-3">
            {item.description}
          </p>
        )}
      </div>

      {navigation.kind !== 'none' && (
        <div className="mt-3 pt-2.5 border-t border-[#E5E3DC]/70 flex items-center justify-between text-xs font-semibold text-[#28634F]">
          <span>
            {normalizedType === 'VIDEO'
              ? 'Watch video'
              : normalizedType === 'BOOK'
                ? 'View book'
                : 'Read article'}
          </span>
          <span className="group-hover:translate-x-0.5 transition-transform">
            {navigation.kind === 'external' ? '↗' : '→'}
          </span>
        </div>
      )}
    </>
  );

  const sharedCardClass =
    'p-4 rounded-xl bg-[#F8F7F2] border border-[#E5E3DC] hover:border-[#28634F]/40 transition-colors flex flex-col justify-between group focus:outline-none focus:ring-2 focus:ring-[#28634F]';

  if (navigation.kind === 'external') {
    return (
      <a
        href={navigation.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => openExternalUrl(navigation.href, e)}
        className={sharedCardClass}
      >
        {cardContent}
      </a>
    );
  }

  if (navigation.kind === 'internal') {
    return (
      <Link to={navigation.href} className={sharedCardClass}>
        {cardContent}
      </Link>
    );
  }

  return <article className={sharedCardClass}>{cardContent}</article>;
}

export default function ProfileContentShowcase({
  creatorName,
  content = [],
  isLoading = false,
  error = null,
  onRetry = null,
}) {
  const [selectedType, setSelectedType] = useState('ALL');

  const safeItems = Array.isArray(content) ? content : [];

  const availableTypes = useMemo(() => {
    const types = new Set(safeItems.map((item) => normalizeContentType(item.type)));
    return ['ALL', ...['ARTICLE', 'VIDEO', 'BOOK'].filter((t) => types.has(t))];
  }, [safeItems]);

  const filteredItems = useMemo(() => {
    if (selectedType === 'ALL') return safeItems;
    return safeItems.filter((item) => normalizeContentType(item.type) === selectedType);
  }, [safeItems, selectedType]);

  const isNotImplementedError = error?.response?.status === 501;

  return (
    <section
      aria-labelledby="creator-content-heading"
      className="bg-white border border-[#E5E3DC] rounded-2xl p-6 sm:p-8 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
        <h2
          id="creator-content-heading"
          className="font-serif text-xl sm:text-2xl font-bold text-[#192521] tracking-tight"
        >
          Published Knowledge &amp; Resources
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#5A6561] bg-[#F8F7F2] px-2.5 py-1 rounded-lg border border-[#E5E3DC]">
            {safeItems.length} {safeItems.length === 1 ? 'item' : 'items'}
          </span>
          <Link
            to="/content"
            className="text-xs font-semibold text-[#28634F] hover:text-[#1E4D3D] hover:underline underline-offset-2 transition-colors"
          >
            Content Hub &rarr;
          </Link>
        </div>
      </div>

      {/* Independent Content Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse" aria-label="Loading published resources">
          {[0, 1].map((idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#F8F7F2] border border-[#E5E3DC] space-y-3">
              <div className="flex justify-between">
                <div className="h-4 w-16 bg-[#EDEBE4] rounded" />
                <div className="h-3 w-20 bg-[#EDEBE4] rounded" />
              </div>
              <div className="h-4 w-3/4 bg-[#EDEBE4] rounded" />
              <div className="h-3 w-full bg-[#EDEBE4] rounded" />
              <div className="h-3 w-2/3 bg-[#EDEBE4] rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Independent Content Error State (when non-501 failure occurs) */}
      {!isLoading && error && !isNotImplementedError && (
        <div className="p-6 rounded-xl bg-[#FCEEEA]/60 border border-[#F3D7D1] text-center">
          <p className="font-serif text-sm sm:text-base font-bold text-[#192521] mb-1">
            Could not load published resources
          </p>
          <p className="text-xs sm:text-sm text-[#5A6561] max-w-md mx-auto mb-4 leading-relaxed">
            {error?.response?.data?.error?.message || error?.message || 'Unable to reach the content showcase endpoint right now.'}
          </p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              style={{ backgroundColor: '#28634F', color: '#FFFFFF' }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#28634F] hover:bg-[#1E4D3D] transition-colors shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#28634F]"
            >
              Retry Content Load
            </button>
          )}
        </div>
      )}

      {/* Content Filter Tabs + Grid when live records exist */}
      {!isLoading && (!error || isNotImplementedError) && safeItems.length > 0 && (
        <div className="space-y-4">
          {availableTypes.length > 2 && (
            <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter creator content by type">
              {availableTypes.map((typeKey) => {
                const isActive = selectedType === typeKey;
                const label = typeKey === 'ALL'
                  ? `All (${safeItems.length})`
                  : `${CONTENT_TYPE_CONFIG[typeKey].label}s`;
                return (
                  <button
                    key={typeKey}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setSelectedType(typeKey)}
                    style={isActive ? { backgroundColor: '#28634F', color: '#FFFFFF' } : undefined}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#28634F] text-white border-[#28634F]'
                        : 'bg-[#F8F7F2] text-[#5A6561] border-[#E5E3DC] hover:text-[#192521] hover:border-[#28634F]/40'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <ContentItemCard key={item.id || item.title} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (!error || isNotImplementedError) && safeItems.length === 0 && (
        <div className="p-6 sm:p-8 rounded-xl bg-[#F8F7F2] border border-[#E5E3DC] text-center">
          <div className="w-10 h-10 mx-auto mb-2.5 rounded-full bg-[#EDEBE4] flex items-center justify-center text-[#5A6561]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="font-serif text-sm sm:text-base font-bold text-[#192521] mb-1">
            No published resources yet
          </h3>
          <p className="text-xs sm:text-sm text-[#5A6561] max-w-md mx-auto leading-relaxed">
            {creatorName} has not published articles, videos, or books yet. Check back soon or explore community resources in the Content Hub.
          </p>
        </div>
      )}
    </section>
  );
}

