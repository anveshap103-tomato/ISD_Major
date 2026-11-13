
import api from '../../../services/api.js';

export const fetchContent = async (params = {}, options = {}) => {
  const response = await api.get('/content', { params, ...options });
  return response.data.data;
};

export const fetchCategories = async (options = {}) => {
  const response = await api.get('/content/categories', options);
  return response.data.data;
};

export const fetchBookmarks = async (options = {}) => {
  const response = await api.get('/content/bookmarks', options);
  const data = response.data?.data;
  return Array.isArray(data) ? data : data?.items || [];
};

export const fetchContentBookmarks = fetchBookmarks;

export const addBookmark = async (contentId) => {
  const response = await api.post('/content/bookmarks', { contentId });
  return response.data?.data;
};

export const addContentBookmark = addBookmark;

export const removeBookmark = async (contentId) => {
  const response = await api.delete(
    `/content/bookmarks/${encodeURIComponent(contentId)}`
  );
  return response.data?.data;
};

export const removeContentBookmark = removeBookmark;
