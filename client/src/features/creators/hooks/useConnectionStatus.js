import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  sendConnectionRequest,
  fetchUserConnections,
  acceptConnectionRequest,
} from '../services/connectionsApi.js';

export const getCurrentUser = () => {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('user') : null;
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getAuthToken = () => {
  return typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
};

/**
 * Determine the connection relationship between current user and target creator userId.
 *
 * @param {string} targetUserId - Target User.id
 * @param {Object} connectionsData - Result of fetchUserConnections
 * @param {string} currentUserId - Current authenticated user ID
 * @returns {'SELF' | 'UNAUTHENTICATED' | 'CONNECTED' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'IDLE'}
 */
export const determineConnectionStatus = (targetUserId, connectionsData, currentUserId) => {
  if (!currentUserId) return 'UNAUTHENTICATED';
  if (!targetUserId) return 'IDLE';
  if (currentUserId === targetUserId) return 'SELF';

  if (!connectionsData) return 'IDLE';

  const { connections = [], sentRequests = [], receivedRequests = [] } = connectionsData;

  const isConnected = connections.some(
    (c) => c.userAId === targetUserId || c.userBId === targetUserId
  );
  if (isConnected) return 'CONNECTED';

  const hasSent = sentRequests.some(
    (r) => r.receiverId === targetUserId && r.status === 'PENDING'
  );
  if (hasSent) return 'PENDING_SENT';

  const hasReceived = receivedRequests.some(
    (r) => r.senderId === targetUserId && r.status === 'PENDING'
  );
  if (hasReceived) return 'PENDING_RECEIVED';

  return 'IDLE';
};

/**
 * Custom React hook to manage connection status and actions for a specific creator.
 *
 * @param {string} targetUserId - User.id of the creator
 * @param {Object} [initialConnectionsData=null] - Pre-fetched connections data (optional)
 * @param {Function} [onStatusChange] - Optional callback when status updates
 */
export default function useConnectionStatus(targetUserId, initialConnectionsData = null, onStatusChange = null) {
  const currentUser = useMemo(() => getCurrentUser(), []);
  const token = useMemo(() => getAuthToken(), []);
  const isAuthenticated = Boolean(token && currentUser?.id);

  const [connectionsData, setConnectionsData] = useState(initialConnectionsData);
  const [isLoading, setIsLoading] = useState(!initialConnectionsData && isAuthenticated);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [localStatusOverride, setLocalStatusOverride] = useState(null);

  // Sync initial connections if provided by parent
  useEffect(() => {
    if (initialConnectionsData) {
      setConnectionsData(initialConnectionsData);
      setIsLoading(false);
    }
  }, [initialConnectionsData]);

  // If no pre-fetched data and user is logged in, fetch connections
  useEffect(() => {
    let ignore = false;

    if (!initialConnectionsData && isAuthenticated) {
      setIsLoading(true);
      fetchUserConnections()
        .then((res) => {
          if (!ignore && res?.data) {
            setConnectionsData(res.data);
          }
        })
        .catch((err) => {
          if (!ignore) {
            console.warn('Could not retrieve user connections:', err?.message);
          }
        })
        .finally(() => {
          if (!ignore) {
            setIsLoading(false);
          }
        });
    }

    return () => {
      ignore = true;
    };
  }, [initialConnectionsData, isAuthenticated]);

  // Derived status
  const status = useMemo(() => {
    if (localStatusOverride) return localStatusOverride;
    if (!isAuthenticated) return 'UNAUTHENTICATED';
    if (!targetUserId) return 'IDLE';
    if (currentUser?.id === targetUserId) return 'SELF';

    return determineConnectionStatus(targetUserId, connectionsData, currentUser?.id);
  }, [localStatusOverride, isAuthenticated, targetUserId, currentUser?.id, connectionsData]);

  // Trigger optional callback when status changes
  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(status);
    }
  }, [status, onStatusChange]);

  // Handle Send Connection Request
  const handleConnect = useCallback(async (note = null) => {
    if (!isAuthenticated) {
      return { success: false, reason: 'UNAUTHENTICATED' };
    }

    if (!targetUserId || currentUser?.id === targetUserId) {
      return { success: false, reason: 'SELF_REQUEST' };
    }

    if (isSending || status === 'PENDING_SENT' || status === 'CONNECTED') {
      return { success: false, reason: 'ALREADY_ACTIVE' };
    }

    setIsSending(true);
    setError(null);

    try {
      const response = await sendConnectionRequest(targetUserId, note);
      setLocalStatusOverride('PENDING_SENT');
      return { success: true, data: response?.data };
    } catch (err) {
      const errCode = err.response?.data?.error?.code;
      const errMsg = err.response?.data?.error?.message || err.message || 'Failed to send connection request';

      if (errCode === 'ALREADY_CONNECTED') {
        setLocalStatusOverride('CONNECTED');
        return { success: true, message: 'You are already connected' };
      } else if (errCode === 'REQUEST_ALREADY_EXISTS') {
        setLocalStatusOverride('PENDING_SENT');
        return { success: true, message: 'Connection request is already pending' };
      } else if (errCode === 'SELF_REQUEST') {
        setLocalStatusOverride('SELF');
        return { success: false, message: 'Cannot connect with yourself' };
      }

      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setIsSending(false);
    }
  }, [isAuthenticated, targetUserId, currentUser?.id, isSending, status]);

  // Handle Accept Incoming Request
  const handleAccept = useCallback(async () => {
    if (!isAuthenticated || !connectionsData) {
      return { success: false, reason: 'UNAUTHENTICATED' };
    }

    const incoming = connectionsData.receivedRequests?.find(
      (r) => r.senderId === targetUserId && r.status === 'PENDING'
    );

    if (!incoming) {
      return { success: false, reason: 'NO_REQUEST_FOUND' };
    }

    setIsSending(true);
    setError(null);

    try {
      await acceptConnectionRequest(incoming.id);
      setLocalStatusOverride('CONNECTED');
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.error?.message || err.message || 'Failed to accept request';
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setIsSending(false);
    }
  }, [isAuthenticated, connectionsData, targetUserId]);

  return {
    status,
    isSending,
    isLoading,
    error,
    isAuthenticated,
    isSelf: status === 'SELF',
    handleConnect,
    handleAccept,
    refetchConnections: () => {
      if (isAuthenticated) {
        fetchUserConnections().then((res) => {
          if (res?.data) setConnectionsData(res.data);
        });
      }
    },
  };
}

