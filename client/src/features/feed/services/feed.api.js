import api from '../../../services/api';

export const getPersonalizedFeed = async () => {
  const response = await api.get('/feed');
  return response.data;
};