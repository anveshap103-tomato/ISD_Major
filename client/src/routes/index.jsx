import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';

const HomePlaceholder = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-900">Ryth Core</h1>

      <p className="text-gray-600 max-w-md">
        Connecting learning, creator discovery, and real-world networking.
      </p>

      <div className="inline-block bg-white shadow rounded-lg px-4 py-2 text-sm text-gray-500">
        Ready for module development (Content, Creators, Connections)
      </div>

      <div>
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
      </Routes>
    </BrowserRouter>
  );
}
