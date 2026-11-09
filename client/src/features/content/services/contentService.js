import api from '../../../services/api';

// Day 3: replace mock-data usage in ContentHubPage with these API calls.
export const getContent = (params) => api.get('/content', { params });
export const getContentById = (id) => api.get(`/content/${id}`);
export const getCategories = () => api.get('/content/categories');
