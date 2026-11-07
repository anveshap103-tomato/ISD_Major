import React from 'react';

export default function ProfileSkills({ skills, category }) {
  return (
    <div className="bg-white border border-[#E5E3DC] rounded-2xl p-6 shadow-sm">
      <h3 className="font-serif text-lg font-bold text-[#192521] tracking-tight mb-4 flex items-center justify-between">
        <span>Skills & Technologies</span>
        {category && (
          <span className="text-[11px] font-semibold text-[#28634F] bg-[#DCE8E0] px-2.5 py-0.5 rounded-lg">
            {category}
          </span>
        )}
      </h3>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1.5 text-xs font-semibold text-[#192521] bg-[#F8F7F2] rounded-xl border border-[#E5E3DC] hover:border-[#28634F]/40 transition-colors"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

