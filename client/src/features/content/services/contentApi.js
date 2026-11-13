import api from '../../../services/api';

export const fetchContentBookmarks = async (options = {}) => {
  const response = await api.get('/content/bookmarks', options);
  return response.data?.data?.items || [];
};

export const addContentBookmark = async (contentId) => {
  const response = await api.post('/content/bookmarks', { contentId });
  return response.data?.data;
};

export const removeContentBookmark = async (contentId) => {
  const response = await api.delete(`/content/bookmarks/${encodeURIComponent(contentId)}`);
  return response.data?.data;
};
