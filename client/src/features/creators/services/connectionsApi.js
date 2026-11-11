import api from '../../../services/api.js';

/**
 * Send a connection request to a creator/user by their User ID.
 *
 * @param {string} receiverId - Target user UUID (User.id, not CreatorProfile.id)
 * @param {string} [note] - Optional introduction note
 * @returns {Promise<Object>} Created connection request response envelope
 */
export const sendConnectionRequest = async (receiverId, note = null) => {
  const payload = { receiverId };
  if (note && typeof note === 'string' && note.trim()) {
    payload.note = note.trim();
  }
  const response = await api.post('/connections/request', payload);
  return response.data;
};

/**
 * Fetch all accepted connections, sent pending requests, and received pending requests for the authenticated user.
 *
 * @returns {Promise<{success: boolean, data: {connections: Array, sentRequests: Array, receivedRequests: Array}}>}
 */
export const fetchUserConnections = async () => {
  const response = await api.get('/connections');
  return response.data;
};

/**
 * Respond to an incoming connection request by accepting or rejecting it.
 *
 * @param {string} requestId - UUID of the connection request
 * @param {'ACCEPTED'|'REJECTED'} status - Target status
 * @returns {Promise<Object>} Updated connection request envelope
 */
export const respondToConnectionRequest = async (requestId, status) => {
  const response = await api.patch(`/connections/${requestId}`, { status });
  return response.data;
};

/**
 * Convenience helper to accept an incoming connection request.
 *
 * @param {string} requestId - UUID of the connection request
 */
export const acceptConnectionRequest = async (requestId) => {
  return respondToConnectionRequest(requestId, 'ACCEPTED');
};

/**
 * Convenience helper to reject an incoming connection request.
 *
 * @param {string} requestId - UUID of the connection request
 */
export const rejectConnectionRequest = async (requestId) => {
  return respondToConnectionRequest(requestId, 'REJECTED');
};

