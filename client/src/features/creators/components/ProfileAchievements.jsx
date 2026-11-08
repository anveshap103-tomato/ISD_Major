import React from 'react';

export default function ProfileAchievements({ achievements }) {
  if (!achievements || achievements.length === 0) return null;

  return (
    <div className="bg-white border border-[#E5E3DC] rounded-2xl p-6 sm:p-8 shadow-sm">
      <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#192521] tracking-tight mb-5 flex items-center gap-2">
        <span>Achievements & Certifications</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {achievements.map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-[#F8F7F2] border border-[#E5E3DC] hover:border-[#28634F]/40 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#EBF3EE] text-[#28634F] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-[#D9A66C] bg-[#FDF5EC] px-2.5 py-0.5 rounded-lg border border-[#D9A66C]/30">
                  {item.year}
                </span>
              </div>

              <h3 className="font-serif text-sm sm:text-base font-bold text-[#192521] leading-snug">
                {item.title}
              </h3>
              <p className="text-xs font-semibold text-[#28634F] mt-0.5">
                {item.issuer}
              </p>
              <p className="text-xs text-[#5A6561] mt-2 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

