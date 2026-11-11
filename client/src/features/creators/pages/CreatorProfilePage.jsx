import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../../components/layout/Navbar';
import { fetchCreatorById, fetchCreatorContent } from '../services/creatorsApi';
import { fetchUserConnections } from '../services/connectionsApi';
import ProfileHeader from '../components/ProfileHeader';
import ProfileAbout from '../components/ProfileAbout';
import ProfileSkills from '../components/ProfileSkills';
import ProfileExperience from '../components/ProfileExperience';
import ProfileAchievements from '../components/ProfileAchievements';
import ConnectButton from '../components/ConnectButton';

// Standard UUID format validator
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isValidUUID = (id) => typeof id === 'string' && UUID_REGEX.test(id.trim());

/**
 * Editorial loading skeleton matching the exact layout and dimensions of CreatorProfilePage
 */
function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#192521] flex flex-col font-sans overflow-x-hidden w-full animate-pulse">
      <Navbar />
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 flex-1 space-y-6 sm:space-y-8">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 bg-[#EDEBE4] rounded w-48" />

        {/* Header Skeleton */}
        <div className="bg-white border border-[#E5E3DC] rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1 w-full">
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl bg-[#EDEBE4] flex-shrink-0" />
              <div className="space-y-3 flex-1 w-full">
                <div className="h-5 bg-[#EDEBE4] rounded w-32" />
                <div className="h-7 bg-[#EDEBE4] rounded w-64" />
                <div className="h-4 bg-[#EDEBE4] rounded w-48" />
                <div className="h-3 bg-[#EDEBE4] rounded w-36" />
                <div className="h-3 bg-[#EDEBE4] rounded w-full max-w-md" />
              </div>
            </div>
            <div className="w-32 h-11 bg-[#EDEBE4] rounded-xl flex-shrink-0" />
          </div>
        </div>

        {/* 2-Column Responsive Layout Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* About Skeleton */}
            <div className="bg-white border border-[#E5E3DC] rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="h-6 bg-[#EDEBE4] rounded w-28" />
              <div className="space-y-2">
                <div className="h-3 bg-[#EDEBE4] rounded w-full" />
                <div className="h-3 bg-[#EDEBE4] rounded w-5/6" />
                <div className="h-3 bg-[#EDEBE4] rounded w-4/6" />
              </div>
            </div>

            {/* Experience Skeleton */}
            <div className="bg-white border border-[#E5E3DC] rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="h-6 bg-[#EDEBE4] rounded w-44" />
              <div className="space-y-3">
                <div className="h-4 bg-[#EDEBE4] rounded w-1/2" />
                <div className="h-3 bg-[#EDEBE4] rounded w-3/4" />
              </div>
            </div>

            {/* Achievements Skeleton */}
            <div className="bg-white border border-[#E5E3DC] rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="h-6 bg-[#EDEBE4] rounded w-52" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-28 bg-[#EDEBE4] rounded-xl" />
                <div className="h-28 bg-[#EDEBE4] rounded-xl" />
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-white border border-[#E5E3DC] rounded-2xl p-6 space-y-4">
              <div className="h-5 bg-[#EDEBE4] rounded w-36" />
              <div className="flex flex-wrap gap-2">
                <div className="h-8 bg-[#EDEBE4] rounded-xl w-20" />
                <div className="h-8 bg-[#EDEBE4] rounded-xl w-24" />
                <div className="h-8 bg-[#EDEBE4] rounded-xl w-16" />
                <div className="h-8 bg-[#EDEBE4] rounded-xl w-28" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CreatorProfilePage() {
  const { id } = useParams();

  const [creator, setCreator] = useState(null);
  const [contentData, setContentData] = useState(null);
  const [connectionsData, setConnectionsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [retryCounter, setRetryCounter] = useState(0);

  // Fetch authenticated user's connections once to synchronize header & sidebar Connect buttons
  const loadConnections = useCallback(async () => {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;
    try {
      const res = await fetchUserConnections();
      if (res?.data) {
        setConnectionsData(res.data);
      }
    } catch (err) {
      console.warn('Could not load user connections on profile page:', err?.message);
    }
  }, []);

  useEffect(() => {
    loadConnections();
  }, [loadConnections]);

  // Fetch creator profile and content from backend API with stale-response protection
  useEffect(() => {
    let ignore = false;

    // Fast-fail on clearly invalid route parameters without firing network requests
    if (!id || !isValidUUID(id)) {
      setCreator(null);
      setContentData(null);
      setError(null);
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    const loadProfileData = async () => {
      setIsLoading(true);
      setError(null);
      setNotFound(false);
      setCreator(null);
      setContentData(null);

      const trimmedId = id.trim();

      try {
        // 1. Fetch primary creator profile
        const profileRes = await fetchCreatorById(trimmedId);

        if (ignore) return;

        if (profileRes && profileRes.success && profileRes.data?.creator) {
          setCreator(profileRes.data.creator);
        } else {
          setNotFound(true);
          setIsLoading(false);
          return;
        }

        // 2. Independently load optional creator content without blocking profile display
        try {
          const contentRes = await fetchCreatorContent(trimmedId);
          if (!ignore && contentRes && contentRes.success && contentRes.data) {
            setContentData(contentRes.data);
          }
        } catch (contentErr) {
          console.warn('Optional creator content could not be loaded:', contentErr?.message);
          if (!ignore) {
            setContentData({ content: [], count: 0 });
          }
        }
      } catch (err) {
        if (!ignore) {
          console.error('Failed to load creator profile from API:', err);
          if (err.response?.status === 404 || err.response?.data?.error?.code === 'NOT_FOUND') {
            setNotFound(true);
          } else {
            setError(err);
          }
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadProfileData();

    return () => {
      ignore = true; // Stale-response protection: cancel effect when UUID changes
    };
  }, [id, retryCounter]);

  // Defensively map profile fields to ensure no null/undefined breaks child components
  const safeCreator = useMemo(() => {
    if (!creator) return null;

    return {
      ...creator,
      name: creator.name || 'Practitioner',
      role: creator.role || creator.professionalTitle || 'Creator',
      company: creator.company || creator.organization || '',
      location: creator.location || '',
      avatar: creator.avatar || creator.profileImage || '',
      headline: creator.headline || creator.introduction || '',
      bio: creator.bio || creator.biography || '',
      detailedBio: Array.isArray(creator.detailedBio) && creator.detailedBio.length > 0
        ? creator.detailedBio
        : (creator.bio ? [creator.bio] : []),
      category: creator.category || 'General',
      experienceYears: creator.experienceYears ?? 0,
      skills: Array.isArray(creator.skills) ? creator.skills : [],
      expertiseAreas: Array.isArray(creator.expertiseAreas) ? creator.expertiseAreas : [],
      experienceHistory: Array.isArray(creator.experienceHistory) ? creator.experienceHistory : [],
      achievements: Array.isArray(creator.achievements) ? creator.achievements : [],
      socialLinks: creator.socialLinks && typeof creator.socialLinks === 'object'
        ? creator.socialLinks
        : {},
    };
  }, [creator]);

  const handleRetry = () => {
    setRetryCounter((c) => c + 1);
  };

  // 1. Loading State
  if (isLoading) {
    return <ProfileSkeleton />;
  }

  // 2. Error State (Network or 500 error) — checked before !safeCreator so Retry UI is reachable
  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] text-[#192521] flex flex-col font-sans">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#FCEEEA] flex items-center justify-center text-[#B84E3C]">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#192521] mb-2">
            Unable to Load Profile
          </h2>
          <p className="text-sm text-[#5A6561] mb-6 max-w-md mx-auto leading-relaxed">
            {error?.response?.data?.error?.message || error?.message || 'A network error occurred while connecting to the creator service. Please check your connection and try again.'}
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleRetry}
              style={{ backgroundColor: '#28634F', color: '#FFFFFF' }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#28634F] hover:bg-[#1E4D3D] transition-colors shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#28634F]"
            >
              Retry
            </button>
            <Link
              to="/creators"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#192521] bg-white border border-[#E5E3DC] hover:bg-[#EFECE3] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#28634F]"
            >
              Back to Creators
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // 3. Not Found State (404 or Invalid UUID)
  if (notFound || !safeCreator) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] text-[#192521] flex flex-col font-sans">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#EBF3EE] flex items-center justify-center text-[#28634F]">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#192521] mb-2">
            Creator Not Found
          </h2>
          <p className="text-sm text-[#5A6561] mb-6 max-w-md mx-auto leading-relaxed">
            The practitioner profile you are looking for does not exist or has been relocated.
          </p>
          <Link
            to="/creators"
            style={{ backgroundColor: '#28634F', color: '#FFFFFF' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#28634F] hover:bg-[#1E4D3D] transition-colors shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#28634F]"
          >
            <span>&larr;</span> Back to Creators
          </Link>
        </main>
      </div>
    );
  }

  // 4. Populated Profile View
  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#192521] flex flex-col font-sans overflow-x-hidden w-full">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 flex-1 space-y-6 sm:space-y-8">
        {/* Navigation Breadcrumb & Back Link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link
            to="/creators"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#28634F] hover:text-[#1E4D3D] transition-colors group w-fit cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#28634F] rounded"
          >
            <span className="group-hover:-translate-x-1 transition-transform">&larr;</span>
            <span>Back to Creator Discovery</span>
          </Link>

          <nav className="text-xs text-[#5A6561] flex items-center gap-1.5" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#192521] transition-colors">Directory</Link>
            <span>/</span>
            <Link to="/creators" className="hover:text-[#192521] transition-colors">Creators</Link>
            <span>/</span>
            <span className="text-[#192521] font-semibold truncate max-w-[180px]">{safeCreator.name}</span>
          </nav>
        </div>

        {/* 1. Profile Header Component */}
        <section>
          <ProfileHeader
            creator={safeCreator}
            connectionsData={connectionsData}
            onConnectionActionSuccess={loadConnections}
          />
        </section>

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {/* Main Content Column (Left / 2 Cols on Desktop) */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* 2. About Section & Areas of Expertise */}
            <ProfileAbout creator={safeCreator} />

            {/* 3. Professional Information & Experience History */}
            <ProfileExperience experienceHistory={safeCreator.experienceHistory} />

            {/* 4. Achievements & Certifications */}
            <ProfileAchievements achievements={safeCreator.achievements} />

            {/* 5. Published Knowledge & Educational Resources Section */}
            <section className="bg-white border border-[#E5E3DC] rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#192521] tracking-tight flex items-center gap-2">
                  <span>Published Knowledge &amp; Resources</span>
                </h2>
                <span className="text-xs font-semibold text-[#5A6561] bg-[#F8F7F2] px-2.5 py-1 rounded-lg border border-[#E5E3DC]">
                  {contentData?.content?.length || 0} items
                </span>
              </div>

              {contentData?.content && contentData.content.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contentData.content.map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-xl bg-[#F8F7F2] border border-[#E5E3DC] hover:border-[#28634F]/40 transition-colors flex flex-col justify-between group focus:outline-none focus:ring-2 focus:ring-[#28634F]"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#28634F] bg-[#DCE8E0] px-2 py-0.5 rounded">
                            {item.type}
                          </span>
                          {item.publishedAt && (
                            <span className="text-[11px] text-[#5A6561]">
                              {item.publishedAt}
                            </span>
                          )}
                        </div>
                        <h3 className="font-serif text-sm sm:text-base font-bold text-[#192521] group-hover:text-[#28634F] transition-colors leading-snug">
                          {item.title}
                        </h3>
                      </div>
                      <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#28634F]">
                        <span>View resource</span>
                        <span>&rarr;</span>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="p-6 sm:p-8 rounded-xl bg-[#F8F7F2] border border-[#E5E3DC] text-center">
                  <div className="w-10 h-10 mx-auto mb-2.5 rounded-full bg-[#EDEBE4] flex items-center justify-center text-[#5A6561]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-sm sm:text-base font-bold text-[#192521] mb-1">
                    No published resources yet
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A6561] max-w-md mx-auto leading-relaxed">
                    {safeCreator.name} has not published educational resources or guides yet. Check back soon for upcoming articles and learning materials.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar Column (Right / 1 Col on Desktop) */}
          <div className="space-y-6 sm:space-y-8">
            {/* 6. Skills & Technologies */}
            <ProfileSkills skills={safeCreator.skills} category={safeCreator.category} />

            {/* Mentorship & Real-World Networking Callout */}
            <div className="bg-[#EBF3EE] border border-[#C5DACE] rounded-2xl p-6 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-[#28634F] text-white flex items-center justify-center mb-3">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>

              <h3 className="font-serif text-lg font-bold text-[#192521] tracking-tight mb-1.5">
                Aspiring to enter this field?
              </h3>
              <p className="text-xs sm:text-sm text-[#5A6561] leading-relaxed mb-4">
                Connect with {safeCreator.name} to exchange insights, review career progression milestones, and learn how to navigate {safeCreator.category}.
              </p>

              <div className="p-3 bg-white rounded-xl border border-[#DCE8E0] text-xs text-[#28634F] font-medium flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#28634F] flex-shrink-0 animate-pulse" />
                <span>Open for mentoring &amp; career advice</span>
              </div>

              <div className="pt-2">
                <ConnectButton
                  variant="profile"
                  userId={safeCreator.userId}
                  creatorName={safeCreator.name}
                  connectionsData={connectionsData}
                  onActionSuccess={loadConnections}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
