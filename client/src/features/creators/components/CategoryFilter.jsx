import React from 'react';

// Domain-specific icons
const getCategoryIcon = (category, isActive) => {
  const iconColorClass = isActive ? 'text-white' : 'text-[#28634F]';

  switch (category) {
    case 'All':
      return (
        <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${iconColorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case 'AI & Machine Learning':
      return (
        <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${iconColorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      );
    case 'Cloud & DevOps':
      return (
        <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${iconColorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h11a3 3 0 00.8-5.89A5 5 0 0011 8.1 4 4 0 003 15z" />
        </svg>
      );
    case 'Frontend & Design':
      return (
        <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${iconColorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8m-4-4v4" />
        </svg>
      );
    case 'Backend & Systems':
      return (
        <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${iconColorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      );
    case 'Cybersecurity':
      return (
        <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${iconColorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'Product & Tech Leadership':
      return (
        <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${iconColorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 20V10M12 20V4M6 20v-6" />
        </svg>
      );
    default:
      return null;
  }
};

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="w-full overflow-hidden">
      <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto scroll-smooth no-scrollbar py-1 px-4 -mx-4 sm:mx-0 sm:px-0 touch-pan-x">
        {categories.map((category) => {
          const isActive = selectedCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelectCategory(category)}
              style={
                isActive
                  ? { backgroundColor: '#28634F', color: '#FFFFFF', borderColor: '#28634F' }
                  : undefined
              }
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 border cursor-pointer flex-shrink-0 touch-manipulation min-h-[38px] sm:min-h-[42px] ${
                isActive
                  ? 'bg-[#28634F] text-white border-[#28634F] shadow-sm ring-1 ring-[#28634F]'
                  : 'bg-white text-[#192521] border-[#E5E3DC] hover:border-[#28634F] hover:bg-[#F0F5F2] hover:text-[#28634F]'
              }`}
            >
              <span>{getCategoryIcon(category, isActive)}</span>
              <span className={isActive ? 'text-white font-semibold' : 'text-[#192521]'}>
                {category}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
