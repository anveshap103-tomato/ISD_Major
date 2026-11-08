import React from 'react';
import CreatorCard from './CreatorCard';

export default function CreatorGrid({ creators, onViewProfile, onResetFilters }) {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
      {creators.map((creator) => (
        <CreatorCard
          key={creator.id}
          creator={creator}
          onViewProfile={onViewProfile}
        />
      ))}
    </div>
  );
}
