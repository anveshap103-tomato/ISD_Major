import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import CreatorListingPage from '../features/creators/pages/CreatorListingPage';

// Placeholder Home / Splash view styled with Ryth Core design tokens
const HomePlaceholder = () => (
  <div className="min-h-screen flex flex-col justify-center items-center p-6 text-center bg-canvas">
    <div className="max-w-md space-y-4">
      <p className="text-[11px] font-medium tracking-widest uppercase text-accent">
        Ryth Core
      </p>
      <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal tracking-tight">
        Learning, Discovery & Real-World Networking
      </h1>
      <p className="text-sm text-ink-muted leading-relaxed">
        Explore knowledge, discover practitioners, and build real-world connections.
      </p>
      <div className="pt-3">
        <Link
          to="/creators"
          className="inline-flex items-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-accent hover:bg-accent-hover rounded-md transition-colors duration-150"
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
        <Route path="*" element={<Navigate to="/creators" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
