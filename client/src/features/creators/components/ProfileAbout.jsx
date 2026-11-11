import React from 'react';

export default function ProfileAbout({ creator }) {
  const { detailedBio, bio, expertiseAreas } = creator;

  const paragraphs = Array.isArray(detailedBio) && detailedBio.length > 0
    ? detailedBio.filter(Boolean)
    : (bio ? [bio] : []);

  return (
    <div className="bg-white border border-[#E5E3DC] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* About Biography Section */}
      <div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#192521] tracking-tight mb-4 flex items-center gap-2">
          <span>About</span>
        </h2>
        {paragraphs.length > 0 ? (
          <div className="space-y-3.5 text-sm sm:text-base text-[#5A6561] leading-relaxed">
            {paragraphs.map((para, index) => (
              <p key={index}>{para}</p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#5A6561] italic">
            No biography provided yet.
          </p>
        )}
      </div>

      {/* Areas of Expertise */}
      {expertiseAreas && expertiseAreas.length > 0 && (
        <div className="pt-6 border-t border-[#EDEBE4]">
          <h3 className="font-serif text-lg font-bold text-[#192521] tracking-tight mb-3">
            Areas of Expertise
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {expertiseAreas.map((area, index) => (
              <div
                key={index}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F8F7F2] border border-[#E5E3DC]"
              >
                <div className="w-5 h-5 rounded-md bg-[#DCE8E0] text-[#28634F] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-medium text-[#192521]">
                  {area}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

