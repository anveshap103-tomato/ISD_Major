import React from 'react';

export default function ContentFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  selectedType,
  onTypeChange,
  search,
  onSearchChange,
}) {
  return (
    <div className="space-y-4">
      <label className="block">
        <span className="sr-only">Search learning resources</span>
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search articles, videos, and books"
          className="w-full rounded-xl border border-[#DADDD7] bg-white px-4 py-3 text-sm text-[#192521] outline-none placeholder:text-[#8A928D] focus:border-[#28634F] focus:ring-2 focus:ring-[#28634F]/15"
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1" aria-label="Filter by category">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              aria-pressed={selectedCategory === category}
              className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                selectedCategory === category
                  ? 'bg-[#28634F] text-white'
                  : 'border border-[#DADDD7] bg-white text-[#53605A] hover:border-[#28634F] hover:text-[#28634F]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <label className="flex shrink-0 items-center gap-2 text-xs font-medium text-[#5A6561]">
          <span>Type</span>
          <select
            value={selectedType}
            onChange={(event) => onTypeChange(event.target.value)}
            className="rounded-lg border border-[#DADDD7] bg-white px-3 py-2 text-sm text-[#192521] outline-none focus:border-[#28634F]"
          >
            <option value="all">All resources</option>
            <option value="article">Articles</option>
            <option value="video">Videos</option>
            <option value="book">Books</option>
          </select>
        </label>
      </div>
    </div>
  );
}
