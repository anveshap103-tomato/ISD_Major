import api from '../../../services/api.js';

/**
 * Fetch a paginated list of creators from the backend API with optional multi-attribute filters.
 *
 * @param {Object} [params={}] - Optional query parameters
 * @param {string} [params.search] - Search keyword across name, role, company, biography
 * @param {string} [params.category] - Domain category filter (e.g. "Cloud & DevOps", "All")
 * @param {string} [params.skill] - Filter creators possessing a specific skill tag
 * @param {number|string} [params.page=1] - Page number for pagination
 * @param {number|string} [params.limit=10] - Number of creators per page
 * @returns {Promise<{success: boolean, data: {creators: Array, total: number, page: number, totalPages: number}, message: string}>} Standardized response envelope
 */
export const fetchCreators = async (params = {}) => {
  const response = await api.get('/creators', { params });
  return response.data;
};

/**
 * Retrieve the complete profile of a single creator by their unique PostgreSQL UUID.
 *
 * @param {string} id - Creator UUID (e.g., "1eb08dc3-f87d-4634-8117-477a8fa48e46")
 * @returns {Promise<{success: boolean, data: {creator: Object}, message: string}>} Complete creator profile envelope
 */
export const fetchCreatorById = async (id) => {
  const response = await api.get(`/creators/${id}`);
  return response.data;
};

/**
 * Dedicated creator search endpoint querying across credentials, name, and skills.
 *
 * @param {Object} [params={}] - Search criteria
 * @param {string} [params.q] - Search keyword query alias
 * @param {string} [params.query] - Search keyword query
 * @param {string} [params.skill] - Exact or partial skill filter
 * @param {string} [params.expertise] - Domain category / expertise filter
 * @returns {Promise<{success: boolean, data: {results: Array, query: string, count: number}, message: string}>} Search results envelope
 */
export const searchCreators = async (params = {}) => {
  const response = await api.get('/creators/search', { params });
  return response.data;
};

/**
 * Retrieve published or curated educational content for a specific creator.
 *
 * @param {string} id - Creator UUID
 * @returns {Promise<{success: boolean, data: {creatorId: string, creatorName: string, content: Array, count: number}, message: string}>} Creator content envelope
 */
export const fetchCreatorContent = async (id) => {
  const response = await api.get(`/creators/${id}/content`);
  return response.data;
};

