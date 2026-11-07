import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Navbar from '../../../components/layout/Navbar';
import { MOCK_CREATORS } from '../data/mockCreators';
import ProfileHeader from '../components/ProfileHeader';
import ProfileAbout from '../components/ProfileAbout';
import ProfileSkills from '../components/ProfileSkills';
import ProfileExperience from '../components/ProfileExperience';
import ProfileAchievements from '../components/ProfileAchievements';

export default function CreatorProfilePage() {
  const { id } = useParams();

  // Find creator by ID or fallback to the first one for robustness
  const creator = MOCK_CREATORS.find((c) => c.id === id);

  if (!creator) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] text-[#192521] flex flex-col font-sans">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h2 className="font-serif text-2xl font-bold text-[#192521] mb-2">
            Creator Not Found
          </h2>
          <p className="text-sm text-[#5A6561] mb-6">
            The practitioner profile you are looking for does not exist or has been relocated.
          </p>
          <Link
            to="/creators"
            style={{ backgroundColor: '#28634F', color: '#FFFFFF' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#28634F] hover:bg-[#1E4D3D] transition-colors"
          >
            <span>&larr;</span> Back to Creators
          </Link>
        </main>
      </div>
    );
  }

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
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#28634F] hover:text-[#1E4D3D] transition-colors group w-fit cursor-pointer"
          >
            <span className="group-hover:-translate-x-1 transition-transform">&larr;</span>
            <span>Back to Creator Discovery</span>
          </Link>

          <nav className="text-xs text-[#5A6561] flex items-center gap-1.5" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#192521] transition-colors">Directory</Link>
            <span>/</span>
            <Link to="/creators" className="hover:text-[#192521] transition-colors">Creators</Link>
            <span>/</span>
            <span className="text-[#192521] font-semibold truncate max-w-[180px]">{creator.name}</span>
          </nav>
        </div>

        {/* 1. Profile Header Component */}
        <section>
          <ProfileHeader creator={creator} />
        </section>

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {/* Main Content Column (Left / 2 Cols on Desktop) */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* 2. About Section & Areas of Expertise */}
            <ProfileAbout creator={creator} />

            {/* 5. Professional Information & Experience History */}
            <ProfileExperience experienceHistory={creator.experienceHistory} />

            {/* 4. Achievements & Certifications */}
            <ProfileAchievements achievements={creator.achievements} />
          </div>

          {/* Sidebar Column (Right / 1 Col on Desktop) */}
          <div className="space-y-6 sm:space-y-8">
            {/* 3. Skills & Technologies */}
            <ProfileSkills skills={creator.skills} category={creator.category} />

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
                Connect with {creator.name} to exchange insights, review career progression milestones, and learn how to navigate {creator.category}.
              </p>

              <div className="p-3 bg-white rounded-xl border border-[#DCE8E0] text-xs text-[#28634F] font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#28634F] flex-shrink-0 animate-pulse" />
                <span>Open for mentoring & career advice</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

