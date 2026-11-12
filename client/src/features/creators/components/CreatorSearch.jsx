import React from 'react';

export default function CreatorSearch({ searchTerm, onSearchChange, onClear, onSearchSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center w-full bg-white border border-[#E5E3DC] rounded-xl sm:rounded-2xl p-1 sm:p-1.5 shadow-sm focus-within:border-[#28634F] focus-within:ring-1 focus-within:ring-[#28634F] transition-all duration-200">
        {/* Search Icon */}
        <div className="pl-3 sm:pl-4 pr-1.5 flex items-center pointer-events-none text-[#5A6561] flex-shrink-0">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>

        {/* Responsive Input: 16px font prevents mobile WebView auto-zoom; min-w-0 prevents flex overflow */}
        <input
          type="text"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, role, or skill..."
          aria-label="Search creators by name, role, organization, or skill"
          className="flex-1 min-w-0 min-h-[44px] bg-transparent text-base text-[#192521] placeholder:text-sm sm:placeholder:text-base placeholder:text-[#5A6561]/65 focus:outline-none px-1.5 sm:px-2 py-2"
        />

        {/* Clear Button (44x44px touch target) */}
        {searchTerm && (
          <button
            type="button"
            onClick={onClear}
            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-[#5A6561] hover:text-[#192521] rounded-lg hover:bg-[#EFECE3]/60 transition-colors flex-shrink-0 touch-manipulation cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#28634F]/40"
            title="Clear search"
            aria-label="Clear search input"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Search Button with >=44px touch target */}
        <button
          type="submit"
          style={{ backgroundColor: '#28634F', color: '#FFFFFF' }}
          className="min-h-[44px] bg-[#28634F] hover:bg-[#1E4D3D] text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-5 rounded-lg sm:rounded-xl shadow-sm transition-colors duration-150 flex items-center gap-1.5 flex-shrink-0 cursor-pointer touch-manipulation focus:outline-none focus:ring-2 focus:ring-[#28634F]"
        >
          <span>Search</span>
          <span className="text-sm sm:text-base leading-none">&rarr;</span>
        </button>
      </div>
    </form>
  );
}
