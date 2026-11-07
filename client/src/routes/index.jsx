import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import CreatorListingPage from '../features/creators/pages/CreatorListingPage';
import CreatorProfilePage from '../features/creators/pages/CreatorProfilePage';

// Placeholder Home / Splash view styled with Ryth Core design tokens
const HomePlaceholder = () => (
  <div className="min-h-screen flex flex-col justify-center items-center p-6 text-center bg-[#F7F5EF]">
    <div className="max-w-md space-y-4">
      <p className="text-[11px] font-medium tracking-widest uppercase text-[#28634F]">
        Ryth Core
      </p>
      <h1 className="font-serif text-3xl sm:text-4xl text-[#192521] font-normal tracking-tight">
        Learning, Discovery &amp; Real-World Networking
      </h1>
      <p className="text-sm text-[#5A6561] leading-relaxed">
        Explore knowledge, discover practitioners, and build real-world connections.
      </p>
      <div className="pt-3">
        <Link
          to="/creators"
          style={{ backgroundColor: '#28634F', color: '#FFFFFF' }}
          className="inline-flex items-center px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#28634F] hover:bg-[#1E4D3D] rounded-xl shadow-sm transition-colors duration-150"
        >
          Explore Creators &rarr;
        </Link>
      </div>
    </div>
  </div>
);

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePlaceholder />} />
        <Route path="/creators" element={<CreatorListingPage />} />
        <Route path="/creators/:id" element={<CreatorProfilePage />} />
        <Route path="*" element={<Navigate to="/creators" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
