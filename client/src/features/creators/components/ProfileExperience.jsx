import React from 'react';

export default function ProfileExperience({ experienceHistory }) {
  if (!experienceHistory || experienceHistory.length === 0) return null;

  return (
    <div className="bg-white border border-[#E5E3DC] rounded-2xl p-6 sm:p-8 shadow-sm">
      <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#192521] tracking-tight mb-6">
        Professional Experience
      </h2>

      <div className="relative border-l-2 border-[#DCE8E0] ml-3 sm:ml-4 space-y-8 pl-6 sm:pl-8">
        {experienceHistory.map((item, index) => (
          <div key={index} className="relative group">
            {/* Timeline node */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-[#28634F] group-hover:scale-110 transition-transform" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1.5">
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#192521] leading-snug">
                {item.role}
              </h3>
              {item.period && (
                <span className="text-xs font-semibold text-[#5A6561] bg-[#F8F7F2] px-2.5 py-0.5 rounded-lg border border-[#E5E3DC] w-fit">
                  {item.period}
                </span>
              )}
            </div>

            {item.company && (
              <p className="text-xs sm:text-sm font-semibold text-[#28634F] mb-2">
                {item.company}
              </p>
            )}

            {item.description && (
              <p className="text-xs sm:text-sm text-[#5A6561] leading-relaxed">
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

