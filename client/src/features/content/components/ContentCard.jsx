import React from 'react';
import { Link } from 'react-router-dom';

const TYPE_LABELS = {
  article: 'Article',
  video: 'Video',
  book: 'Book',
};

export default function ContentCard({
  item,
  isBookmarked,
  onToggleBookmark,
  isBookmarking = false,
}) {
  return (
    <article className="flex h-full min-w-0 flex-col rounded-2xl border border-[#E5E3DC] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#EBF3EE] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#28634F]">
            {TYPE_LABELS[item.type]}
          </span>
          <span className="text-xs text-[#707A75]">{item.category}</span>
        </div>
        <button
          type="button"
          onClick={() => onToggleBookmark(item.id)}
          disabled={isBookmarking}
          aria-pressed={isBookmarked}
          aria-label={isBookmarking ? `Updating ${item.title} bookmark` : isBookmarked ? `Remove ${item.title} bookmark` : `Bookmark ${item.title}`}
          className={`min-h-11 min-w-11 rounded-full border px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#28634F] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60 ${
            isBookmarked
              ? 'border-[#28634F] bg-[#28634F] text-white'
              : 'border-[#D9DDD7] text-[#28634F] hover:bg-[#EBF3EE]'
          }`}
        >
          {isBookmarking ? 'Updating…' : isBookmarked ? 'Saved' : 'Save'}
        </button>
      </div>

      <h2 className="mt-5 break-words font-serif text-xl font-semibold leading-snug text-[#192521]">
        <Link
          to={`/content/${encodeURIComponent(item.id)}`}
          className="rounded-sm hover:text-[#28634F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#28634F]"
        >
          {item.title}
        </Link>
      </h2>
      <p className="mt-2 flex-1 break-words text-sm leading-6 text-[#5A6561]">{item.description}</p>

      <div className="mt-5 flex items-center justify-between gap-2 border-t border-[#F0EEE8] pt-4 sm:gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-[#34413B]">{item.author}</p>
          <p className="mt-1 text-xs text-[#7C8580]">
            {item.readingTime || 'Open resource details'}
          </p>
        </div>
        <Link
          to={`/content/${encodeURIComponent(item.id)}`}
          className="inline-flex min-h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-lg bg-[#28634F] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#1E4D3D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#28634F] focus-visible:ring-offset-2"
        >
          Details <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
