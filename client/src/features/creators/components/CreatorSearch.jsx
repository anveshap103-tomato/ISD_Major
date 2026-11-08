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

        {/* Responsive Input: min-w-0 prevents flex overflow; concise placeholder avoids clipping */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, role, or skill..."
          className="flex-1 min-w-0 bg-transparent text-xs sm:text-sm md:text-base text-[#192521] placeholder:text-[#5A6561]/65 focus:outline-none px-1.5 sm:px-2 py-2"
        />

        {/* Clear Button */}
        {searchTerm && (
          <button
            type="button"
            onClick={onClear}
            className="p-1.5 mr-1 text-[#5A6561] hover:text-[#192521] transition-colors flex-shrink-0 touch-manipulation"
            title="Clear search"
            aria-label="Clear search input"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Search Button with comfortable touch target */}
        <button
          type="submit"
          style={{ backgroundColor: '#28634F', color: '#FFFFFF' }}
          className="h-10 sm:h-11 bg-[#28634F] hover:bg-[#1E4D3D] text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-5 rounded-lg sm:rounded-xl shadow-sm transition-colors duration-150 flex items-center gap-1.5 flex-shrink-0 cursor-pointer touch-manipulation"
        >
          <span>Search</span>
          <span className="text-sm sm:text-base leading-none">&rarr;</span>
        </button>
      </div>
    </form>
  );
}
