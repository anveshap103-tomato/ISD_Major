import React from 'react';
import CreatorCard from './CreatorCard';

function CreatorSkeletonCard() {
  return (
    <div className="bg-white border border-[#E5E3DC] rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm flex flex-col justify-between h-full animate-pulse">
      <div>
        <div className="flex items-start gap-3">
          <div className="w-1 self-stretch rounded-full bg-[#E5E3DC] my-0.5 flex-shrink-0" />
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl bg-[#EDEBE4] flex-shrink-0" />
          <div className="min-w-0 flex-1 space-y-2 pt-1">
            <div className="h-4 bg-[#EDEBE4] rounded w-3/4" />
            <div className="h-3 bg-[#EDEBE4] rounded w-1/2" />
            <div className="h-2.5 bg-[#EDEBE4] rounded w-1/3" />
          </div>
        </div>

        <div className="mt-4">
          <div className="h-5 bg-[#EDEBE4] rounded-lg w-28" />
        </div>

        <div className="mt-3 space-y-2">
          <div className="h-3 bg-[#EDEBE4] rounded w-full" />
          <div className="h-3 bg-[#EDEBE4] rounded w-5/6" />
          <div className="h-3 bg-[#EDEBE4] rounded w-4/6" />
        </div>

        <div className="mt-4 pt-3.5 border-t border-[#EDEBE4] flex gap-2">
          <div className="h-6 bg-[#EDEBE4] rounded-lg w-16" />
          <div className="h-6 bg-[#EDEBE4] rounded-lg w-20" />
          <div className="h-6 bg-[#EDEBE4] rounded-lg w-14" />
        </div>
      </div>

      <div className="mt-5 pt-3.5 border-t border-[#EDEBE4]">
        <div className="h-10 sm:h-11 bg-[#EDEBE4] rounded-xl w-full" />
      </div>
    </div>
  );
}

export default function CreatorGrid({
  creators = [],
  isLoading = false,
  error = null,
  onRetry = null,
  onViewProfile,
  onResetFilters,
  connectionsData = null,
}) {
  // 1. Loading State
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
        {Array.from({ length: 6 }).map((_, index) => (
          <CreatorSkeletonCard key={index} />
        ))}
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="bg-white border border-[#F3D7D1] rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center my-4 sm:my-6 shadow-sm">
        <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3.5 rounded-full bg-[#FCEEEA] flex items-center justify-center text-[#B84E3C]">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h4 className="font-serif text-base sm:text-lg font-bold text-[#192521] mb-1">
          Unable to load practitioners
        </h4>
        <p className="text-xs sm:text-sm text-[#5A6561] max-w-sm mx-auto mb-4 leading-relaxed">
          {typeof error === 'string'
            ? error
            : error?.response?.data?.error?.message || error?.message || 'A network error occurred while connecting to the creator service.'}
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            style={{ backgroundColor: '#28634F', color: '#FFFFFF' }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#28634F] hover:bg-[#1E4D3D] rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            Retry Connection
          </button>
        )}
      </div>
    );
  }

  // 3. Empty State
  if (creators.length === 0) {
    return (
      <div className="bg-white border border-[#E5E3DC] rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center my-4 sm:my-6 shadow-sm">
        <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3.5 rounded-full bg-[#EBF3EE] flex items-center justify-center text-[#28634F]">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h4 className="font-serif text-base sm:text-lg font-bold text-[#192521] mb-1">
          No practitioners found
        </h4>
        <p className="text-xs sm:text-sm text-[#5A6561] max-w-sm mx-auto mb-4 leading-relaxed">
          We couldn't find any creators matching your search or category filter. Try broadening your search.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            style={{ backgroundColor: '#28634F', color: '#FFFFFF' }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#28634F] hover:bg-[#1E4D3D] rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            Clear Filters & Search
          </button>
        )}
      </div>
    );
  }

  // 4. Populated Grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
      {creators.map((creator) => (
        <CreatorCard
          key={creator.id}
          creator={creator}
          onViewProfile={onViewProfile}
          connectionsData={connectionsData}
        />
      ))}
    </div>
  );
}
