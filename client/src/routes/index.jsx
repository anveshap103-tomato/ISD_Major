import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Placeholder Home / Splash view
const HomePlaceholder = () => (
  <div className="space-y-4">
    <h1 className="text-3xl font-bold text-gray-900">Ryth Core</h1>
    <p className="text-gray-600 max-w-md">
      Connecting learning, creator discovery, and real-world networking.
    </p>
    <div className="inline-block bg-white shadow rounded-lg px-4 py-2 text-sm text-gray-500">
      Ready for module development (Content, Creators, Connections)
    </div>
  </div>
);

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePlaceholder />} />
        {/* Module routes to be registered here by team members */}
      </Routes>
    </BrowserRouter>
  );
}

