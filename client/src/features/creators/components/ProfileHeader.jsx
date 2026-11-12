import React from 'react';
import ConnectButton from './ConnectButton.jsx';
import { openExternalUrl } from '../utils/externalLink.js';

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

export default function ProfileHeader({ creator, connectionsData = null, onConnectionActionSuccess = null }) {
  const {
    name,
    role,
    company,
    location,
    avatar,
    headline,
    category,
    experienceYears,
    socialLinks,
  } = creator;

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Creator')}&background=DCE8E0&color=28634F&size=160&bold=true`;
  const avatarSrc = avatar || fallbackAvatar;

  const theme = DOMAIN_THEMES[category] || {
    badge: 'bg-[#DCE8E0] text-[#28634F]',
    indicator: 'bg-[#28634F]',
  };

  return (
    <div className="bg-white border border-[#E5E3DC] rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
      {/* Top Background Accent Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${theme.indicator}`} />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8 pt-2">
        {/* Left: Avatar & Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 flex-1 min-w-0">
          {/* Profile Image with subtle border and shadow */}
          <div className="relative flex-shrink-0">
            <img
              src={avatarSrc}
              alt={name}
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl object-cover border-2 border-[#E5E3DC] shadow-sm"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackAvatar;
              }}
            />
            {/* Category Marker Dot */}
            <span className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm ${theme.indicator}`}>
              <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
              </svg>
            </span>
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
              {category && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ${theme.badge}`}>
                  {category}
                </span>
              )}
              {experienceYears > 0 && (
                <span className="text-xs text-[#5A6561] font-medium bg-[#F8F7F2] px-2.5 py-0.5 rounded-lg border border-[#E5E3DC]">
                  {experienceYears}+ years experience
                </span>
              )}
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#192521] tracking-tight leading-tight">
              {name}
            </h1>

            <p className="text-sm sm:text-base font-semibold text-[#28634F] mt-1">
              {role} {company && <span className="text-[#5A6561] font-normal">at {company}</span>}
            </p>

            {location && (
              <p className="flex items-center gap-1.5 text-xs sm:text-sm text-[#5A6561] mt-1.5">
                <svg className="w-4 h-4 text-[#5A6561]/80 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{location}</span>
              </p>
            )}

            {headline && (
              <p className="mt-3 text-xs sm:text-sm text-[#5A6561] italic leading-relaxed max-w-2xl font-serif">
                "{headline}"
              </p>
            )}
          </div>
        </div>

        {/* Right: Actions & Social Links */}
        <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 w-full md:w-auto flex-shrink-0">
          {/* Connect Action (Live API Integration) */}
          <ConnectButton
            variant="profile"
            userId={creator.userId}
            creatorName={name}
            connectionsData={connectionsData}
            onActionSuccess={onConnectionActionSuccess}
          />

          {/* Social Links (44x44px touch targets; uses @capacitor/browser on native Android) */}
          {socialLinks && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => openExternalUrl(socialLinks.github, e)}
                  className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-[#5A6561] hover:text-[#192521] rounded-xl hover:bg-[#EFECE3] border border-[#E5E3DC] transition-colors touch-manipulation"
                  title="GitHub Profile"
                  aria-label="GitHub Profile"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => openExternalUrl(socialLinks.linkedin, e)}
                  className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-[#5A6561] hover:text-[#192521] rounded-xl hover:bg-[#EFECE3] border border-[#E5E3DC] transition-colors touch-manipulation"
                  title="LinkedIn Profile"
                  aria-label="LinkedIn Profile"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.37 9.74v-8.37H5.09v8.37h2.74z" />
                  </svg>
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => openExternalUrl(socialLinks.twitter, e)}
                  className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-[#5A6561] hover:text-[#192521] rounded-xl hover:bg-[#EFECE3] border border-[#E5E3DC] transition-colors touch-manipulation"
                  title="X / Twitter Profile"
                  aria-label="X / Twitter Profile"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
              {socialLinks.website && (
                <a
                  href={socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => openExternalUrl(socialLinks.website, e)}
                  className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-[#5A6561] hover:text-[#192521] rounded-xl hover:bg-[#EFECE3] border border-[#E5E3DC] transition-colors touch-manipulation"
                  title="Personal Website"
                  aria-label="Personal Website"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

