import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../../../components/layout/Navbar';
import api from '../../../services/api';
import ContentVideoPlayer from '../components/ContentVideoPlayer';

const TYPE_LABELS = {
  article: 'Article',
  video: 'Video',
  book: 'Book',
};

const formatDate = (dateValue) => {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(date);
};

export default function ContentDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadItem = async () => {
      setLoading(true);
      setError('');
      setItem(null);

      try {
        const response = await api.get(`/content/${encodeURIComponent(id)}`, {
          signal: controller.signal,
        });
        setItem(response.data?.data || null);
        if (!response.data?.data) setError('This resource could not be found.');
      } catch (requestError) {
        if (requestError.code === 'ERR_CANCELED') return;
        const status = requestError.response?.status;
        setError(
          status === 404
            ? 'This resource could not be found.'
            : 'Could not load this resource. Check your connection and try again.'
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadItem();
    return () => controller.abort();
  }, [id, retryCount]);

  const publishedDate = formatDate(item?.createdAt);
  const typeLabel = TYPE_LABELS[item?.type] || 'Resource';

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#192521]">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <Link
          to="/content"
          className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold text-[#28634F] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#28634F]"
        >
          <span aria-hidden="true">←</span> Back to Knowledge Hub
        </Link>

        {loading ? (
          <p className="py-20 text-center text-sm text-[#707A75]" role="status">
            Loading resource…
          </p>
        ) : error ? (
          <section className="mt-8 rounded-2xl border border-dashed border-[#C9D0C9] bg-white/70 px-6 py-12 text-center" role="alert">
            <h1 className="font-serif text-xl font-semibold">{error}</h1>
            {error.startsWith('Could not') && (
              <button
                type="button"
                onClick={() => setRetryCount((attempt) => attempt + 1)}
                className="mt-4 rounded-lg bg-[#28634F] px-4 py-2 text-sm font-semibold text-white"
              >
                Retry
              </button>
            )}
          </section>
        ) : item ? (
          <article className="mt-6 overflow-hidden rounded-2xl border border-[#E5E3DC] bg-white p-4 shadow-sm sm:mt-8 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="rounded-full bg-[#EBF3EE] px-3 py-1 uppercase tracking-wide text-[#28634F]">
                {typeLabel}
              </span>
              {item.category && (
                <span className="rounded-full bg-[#F0EEE8] px-3 py-1 text-[#5A6561]">
                  {item.category}
                </span>
              )}
            </div>

            <h1 className="mt-5 break-words font-serif text-3xl font-semibold leading-tight sm:text-4xl">
              {item.title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#707A75]">
              {item.author && <span>By {item.author}</span>}
              {publishedDate && <time dateTime={item.createdAt}>{publishedDate}</time>}
            </div>

            {item.type === 'video' && (
              <ContentVideoPlayer url={item.url} title={item.title} />
            )}

            {item.description && (
              <p className="mt-6 whitespace-pre-line break-words text-base leading-7 text-[#4F5C56] sm:mt-8">
                {item.description}
              </p>
            )}

            <div className="mt-8 border-t border-[#F0EEE8] pt-6">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-lg bg-[#28634F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1E4D3D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#28634F] focus-visible:ring-offset-2"
              >
                {item.type === 'video' ? 'Watch video' : item.type === 'book' ? 'View book' : 'Read article'}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </article>
        ) : null}
      </main>
    </div>
  );
}
