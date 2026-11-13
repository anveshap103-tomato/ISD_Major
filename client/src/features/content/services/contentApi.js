import api from '../../../services/api.js';

export const fetchContent = async (params = {}) => {
  const response = await api.get('/content', { params });
  return response.data.data;
};

export const fetchCategories = async () => {
  const response = await api.get('/content/categories');
  return response.data.data;
};

export const fetchBookmarks = async () => {
  const response = await api.get('/content/bookmarks');
  return response.data.data;
};

export const addBookmark = async (contentId) => {
  const response = await api.post('/content/bookmarks', { contentId });
  return response.data.data;
};

export const removeBookmark = async (contentId) => {
  const response = await api.delete(`/content/bookmarks/${contentId}`);
  return response.data.data;
};