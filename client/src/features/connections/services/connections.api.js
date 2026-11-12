import api from '../../../services/api';

export const getConnections = async () => {
  const response = await api.get('/connections');
  return response.data;
};

export const sendConnectionRequest = async (receiverId, note = '') => {
  const response = await api.post('/connections/request', {
    receiverId,
    note,
  });
  return response.data;
};

export const respondToConnectionRequest = async (requestId, status) => {
  const response = await api.patch(`/connections/${requestId}`, {
    status,
  });
  return response.data;
};

export const discoverUsers = async () => {
  const response = await api.get('/connections/discover');
  return response.data;
};