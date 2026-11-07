import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';

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

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  return token ? children : <Navigate to="/login" replace />;
};

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
  path="/"
  element={
    <ProtectedRoute>
      <HomePlaceholder />
    </ProtectedRoute>
  }
/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
