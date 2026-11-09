import { CATEGORIES, CONTENT_TYPES } from '../data/mockContent';

export default function ContentFilters({ activeType, activeCategory, onTypeChange, onCategoryChange }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar" aria-label="Content type filters">
        {CONTENT_TYPES.map((type) => (
          <button key={type.value} type="button" onClick={() => onTypeChange(type.value)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${activeType === type.value ? 'bg-[#28634F] text-white' : 'bg-white text-[#4D5B56] ring-1 ring-[#D9DDD8] hover:bg-[#EBF3EE]'}`}>
            {type.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar" aria-label="Category filters">
        {CATEGORIES.map((category) => (
          <button key={category} type="button" onClick={() => onCategoryChange(category)} className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition ${activeCategory === category ? 'bg-[#E2EEE6] text-[#28634F]' : 'text-[#5A6561] hover:bg-[#EFECE3]'}`}>
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
