
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from 'react-router-dom';

import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import CreatorListingPage from '../features/creators/pages/CreatorListingPage';
import CreatorProfilePage from '../features/creators/pages/CreatorProfilePage';

const HomePlaceholder = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
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
            className="inline-flex items-center px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-xl shadow-sm transition-colors duration-150"
          >
            Explore Creators &rarr;
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(null);

  React.useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await fetch(
          'http://localhost:5001/api/auth/me',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          return;
        }

        const result = await response.json();

        localStorage.setItem('user', JSON.stringify(result.data.user));
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, []);

  if (isAuthenticated === null) {
    return <p>Verifying authentication...</p>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
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

        <Route
          path="/creators"
          element={
            <ProtectedRoute>
              <CreatorListingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/creators/:id"
          element={
            <ProtectedRoute>
              <CreatorProfilePage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
