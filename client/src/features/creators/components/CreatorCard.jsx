import React from 'react';
import ConnectButton from './ConnectButton.jsx';

// Domain-specific styling for the category pill & vertical accent indicator
const DOMAIN_THEMES = {
  'Cloud & DevOps': {
    badge: 'bg-[#DCE8E0] text-[#28634F]',
    indicator: 'bg-[#28634F]',
  },
  'AI & Machine Learning': {
    badge: 'bg-[#F9EDE0] text-[#B87A36]',
    indicator: 'bg-[#D9A66C]',
  },
  'Frontend & Design': {
    badge: 'bg-[#E1EFE7] text-[#28634F]',
    indicator: 'bg-[#519478]',
  },
  'Backend & Systems': {
    badge: 'bg-[#EAF1F8] text-[#346585]',
    indicator: 'bg-[#346585]',
  },
  'Cybersecurity': {
    badge: 'bg-[#FCEEEA] text-[#B84E3C]',
    indicator: 'bg-[#C05646]',
  },
  'Product & Tech Leadership': {
    badge: 'bg-[#F8EED9] text-[#9A7028]',
    indicator: 'bg-[#D9A66C]',
  },
};

export default function CreatorCard({ creator, onViewProfile, connectionsData = null }) {
  const {
    name = 'Practitioner',
    role = 'Creator',
    company = '',
    avatar = '',
    bio = '',
    skills = [],
    category = '',
  } = creator || {};

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=DCE8E0&color=28634F&size=128&bold=true`;
  const avatarSrc = avatar || fallbackAvatar;

  const theme = DOMAIN_THEMES[category] || {
    badge: 'bg-[#DCE8E0] text-[#28634F]',
    indicator: 'bg-[#28634F]',
  };

  const handleProfileClick = () => {
    if (onViewProfile) onViewProfile(creator);
  };

  return (
    <article className="bg-white border border-[#E5E3DC] rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md hover:border-[#D1CEC4] transition-all duration-200 flex flex-col justify-between h-full group">
      <div>
        {/* Top Header: Vertical Accent Indicator, Avatar, Info & External Link */}
        <div className="flex items-start justify-between gap-2.5 sm:gap-3">
          <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
            {/* Subtle Vertical Accent Indicator */}
            <div className={`w-1 self-stretch rounded-full my-0.5 flex-shrink-0 ${theme.indicator}`} />

            {/* Profile Avatar (Clickable) */}
            <button
              type="button"
              onClick={handleProfileClick}
              className="text-left flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#28634F]/30 rounded-xl"
              aria-label={`View profile of ${name}`}
            >
              <img
                src={avatarSrc}
                alt={name}
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl object-cover border border-[#E5E3DC] shadow-sm group-hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = fallbackAvatar;
                }}
              />
            </button>

            {/* Name & Title */}
            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={handleProfileClick}
                className="text-left block w-full focus:outline-none group/title"
              >
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#192521] tracking-tight leading-snug group-hover/title:text-[#28634F] transition-colors truncate cursor-pointer">
                  {name}
                </h3>
              </button>
              <p className="text-xs sm:text-sm font-medium text-[#5A6561] mt-0.5 truncate">
                {role}
              </p>
              {company && (
                <p className="text-[11px] sm:text-xs text-[#5A6561]/80 mt-0.5 truncate">
                  @ {company}
                </p>
              )}
            </div>
          </div>

          {/* External Profile Link Icon */}
          <button
            type="button"
            onClick={handleProfileClick}
            className="p-1.5 text-[#5A6561] hover:text-[#28634F] transition-colors rounded-lg hover:bg-[#EFECE3] flex-shrink-0 touch-manipulation cursor-pointer"
            title="Open Profile"
            aria-label={`Open profile of ${name}`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </button>
        </div>

        {/* Domain Badge */}
        {category && (
          <div className="mt-3.5 sm:mt-4">
            <span
              className={`inline-flex items-center px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-semibold ${theme.badge}`}
            >
              {category}
            </span>
          </div>
        )}

        {/* Bio */}
        <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-[#5A6561] leading-relaxed line-clamp-3">
          {bio || 'Practitioner on Ryth Core.'}
        </p>

        {/* Skills Tags */}
        {skills.length > 0 && (
          <div className="mt-3.5 sm:mt-4 pt-3 sm:pt-3.5 border-t border-[#EDEBE4]">
            <div className="flex flex-wrap gap-1.5 items-center">
              {skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 sm:px-2.5 py-0.5 sm:py-1 text-[11px] sm:text-xs font-medium text-[#192521] bg-[#F8F7F2] rounded-lg border border-[#E5E3DC]"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 3 && (
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 text-[11px] sm:text-xs font-medium text-[#5A6561] bg-[#F8F7F2] rounded-lg border border-[#E5E3DC]">
                  +{skills.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Card Actions: Connect & View Profile */}
      <div className="mt-4 sm:mt-5 pt-3 sm:pt-3.5 border-t border-[#EDEBE4] flex items-center gap-2">
        <ConnectButton
          variant="card"
          userId={creator.userId}
          creatorName={name}
          connectionsData={connectionsData}
        />
        <button
          type="button"
          onClick={handleProfileClick}
          className="flex-1 h-9 inline-flex justify-center items-center gap-1.5 px-3 text-xs sm:text-sm font-semibold text-[#192521] bg-white hover:bg-[#EFECE3] border border-[#E5E3DC] rounded-xl shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#28634F]/30 active:scale-[0.99] cursor-pointer touch-manipulation"
        >
          <span>View Profile</span>
          <svg className="w-3.5 h-3.5 text-[#5A6561]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </article>
  );
}
