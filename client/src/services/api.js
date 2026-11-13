import axios from 'axios';

/**
 * Resolves the API base URL dynamically.
 * Prioritizes explicitly configured environment variables unless pointing to localhost on a remote deployment.
 * Automatically falls back to the production Render backend when running on non-localhost hosts (e.g. Vercel).
 */
export const getApiBaseUrl = () => {
  const configuredUrl = import.meta.env?.VITE_API_BASE_URL;

  // If a valid non-localhost URL is provided via environment, use it
  if (
    configuredUrl &&
    !configuredUrl.includes('localhost') &&
    !configuredUrl.includes('127.0.0.1')
  ) {
    return configuredUrl.replace(/\/+$/, '');
  }

  // If running in a browser on a deployed/remote domain (e.g. *.vercel.app), use the production backend
  if (
    typeof window !== 'undefined' &&
    window.location.hostname &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return 'https://ryth-core-hi4b.onrender.com/api';
  }

  // Default fallback for local development
  return (configuredUrl || 'http://localhost:5001/api').replace(/\/+$/, '');
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token if available
api.interceptors.request.use(
  (config) => {
    // Dynamically ensure base URL is current
    if (!config.baseURL || config.baseURL.includes('localhost')) {
      const resolved = getApiBaseUrl();
      if (!resolved.includes('localhost')) {
        config.baseURL = resolved;
      }
    }

    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Standardized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If a request fails with 401 Unauthorized due to an expired or invalid token,
    // clear stale credentials to prevent persistent authentication failure loops.
    if (error.response && error.response.status === 401) {
      const errorData = error.response.data?.error;
      const isTokenIssue =
        errorData?.code === 'INVALID_TOKEN' ||
        errorData?.code === 'UNAUTHORIZED' ||
        (typeof errorData?.message === 'string' &&
          (errorData.message.includes('token') || errorData.message.includes('Access token required')));

      if (isTokenIssue && typeof localStorage !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;

