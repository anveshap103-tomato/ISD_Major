import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/layout/Navbar';

import {
  getConnections,
  respondToConnectionRequest,
  discoverUsers,
  sendConnectionRequest,
} from '../services/connections.api';

export default function ConnectionsPage() {
  const [connections, setConnections] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('connections');
  const [discoveredUsers, setDiscoveredUsers] = useState([]);
const [discoverLoading, setDiscoverLoading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const loadDiscoveredUsers = async () => {
  try {
    setDiscoverLoading(true);

    const response = await discoverUsers();
    const data = response.data || response;

    setDiscoveredUsers(data || []);
  } catch (err) {
    setError(
      err.response?.data?.error?.message ||
      'Unable to discover users. Please try again.'
    );
  } finally {
    setDiscoverLoading(false);
  }
};

const handleSendRequest = async (receiverId) => {
  try {
    await sendConnectionRequest(receiverId);
    await loadConnections();
    await loadDiscoveredUsers();
  } catch (err) {
    setError(
      err.response?.data?.error?.message ||
      'Unable to send connection request.'
    );
  }
};

  const loadConnections = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await getConnections();
      const data = response.data || response;

      setConnections(data.connections || []);
      setSentRequests(data.sentRequests || []);
      setReceivedRequests(data.receivedRequests || []);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
        'Unable to load connections. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConnections();
  }, []);

  const handleResponse = async (requestId, status) => {
    try {
      await respondToConnectionRequest(requestId, status);
      await loadConnections();
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
        'Unable to update connection request.'
      );
    }
  };

  const getOtherUser = (connection) => {
    return connection.userAId === currentUser.id
      ? connection.userB
      : connection.userA;
  };

  const tabs = [
    { id: 'connections', label: 'My Connections', count: connections.length },
    { id: 'received', label: 'Received', count: receivedRequests.length },
    { id: 'sent', label: 'Sent', count: sentRequests.length },
    { id: 'discover', label: 'Discover People', count: discoveredUsers.length },
  ];

  const renderUserCard = (user, actions = null, note = null) => (
    <div
      key={user?.id}
      className="flex items-center justify-between gap-4 rounded-2xl border border-[#E8E5DD] bg-white p-4"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-12 w-12 shrink-0 rounded-full bg-[#E7EEE9] flex items-center justify-center text-[#28634F] font-semibold">
          {user?.name?.charAt(0)?.toUpperCase() || '?'}
        </div>

        <div className="min-w-0">
          <h3 className="font-medium text-[#192521] truncate">
            {user?.name || 'Unknown User'}
          </h3>
          <p className="text-sm text-[#77817C] truncate">
            {user?.email || ''}
          </p>
          {note && (
            <p className="text-sm text-[#5A6561] mt-1">
              "{note}"
            </p>
          )}
        </div>
      </div>

      {actions}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F5EF]">
      <Navbar />
      <div className="px-5 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-[#28634F] mb-2">
            Your Network
          </p>
          <h1 className="text-3xl font-serif text-[#192521]">
            Connections
          </h1>
          <p className="text-sm text-[#77817C] mt-2">
            Manage your network and connection requests.
          </p>
        </div>

        <div className="flex gap-2 border-b border-[#E5E1D8] mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
  setActiveTab(tab.id);

  if (tab.id === 'discover') {
    loadDiscoveredUsers();
  }
}}
              className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-[#28634F] text-[#28634F] font-semibold'
                  : 'border-transparent text-[#77817C]'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center py-12 text-[#77817C]">
            Loading your network...
          </p>
        ) : (
          <div className="space-y-3">
            {activeTab === 'connections' &&
              (connections.length ? (
                connections.map((connection) =>
                  renderUserCard(getOtherUser(connection))
                )
              ) : (
                <p className="text-center py-12 text-[#77817C]">
                  You haven't connected with anyone yet.
                </p>
              ))}

            {activeTab === 'received' &&
              (receivedRequests.length ? (
                receivedRequests.map((request) =>
                  renderUserCard(
                    request.sender,
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() =>
                          handleResponse(request.id, 'ACCEPTED')
                        }
                        className="px-3 py-2 rounded-lg bg-[#28634F] text-white text-xs"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleResponse(request.id, 'REJECTED')
                        }
                        className="px-3 py-2 rounded-lg border border-[#E5E1D8] text-[#5A6561] text-xs"
                      >
                        Reject
                      </button>
                    </div>,
                    request.note
                  )
                )
              ) : (
                <p className="text-center py-12 text-[#77817C]">
                  No pending requests received.
                </p>
              ))}

            {activeTab === 'sent' &&
              (sentRequests.length ? (
                sentRequests.map((request) =>
                  renderUserCard(
                    request.receiver,
                    <span className="text-xs text-[#B7791F] shrink-0">
                      Pending
                    </span>,
                    request.note
                  )
                )
              ) : (
                <p className="text-center py-12 text-[#77817C]">
                  No pending requests sent.
                </p>
              ))}

              {activeTab === 'discover' && (
  discoverLoading ? (
    <p className="text-center py-12 text-[#77817C]">
      Finding people...
    </p>
  ) : discoveredUsers.length ? (
    discoveredUsers.map((user) => {
      const alreadyConnected = connections.some(
        (connection) =>
          connection.userAId === user.id ||
          connection.userBId === user.id
      );

      const requestSent = sentRequests.some(
        (request) => request.receiver?.id === user.id
      );

      const requestReceived = receivedRequests.some(
        (request) => request.sender?.id === user.id
      );

      return renderUserCard(
        user,
        <button
          disabled={alreadyConnected || requestSent || requestReceived}
          onClick={() => handleSendRequest(user.id)}
          className="px-4 py-2 rounded-lg bg-[#28634F] text-white text-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {alreadyConnected
            ? 'Connected'
            : requestSent
            ? 'Request Sent'
            : requestReceived
            ? 'Respond to Request'
            : 'Connect'}
        </button>
      );
    })
  ) : (
    <p className="text-center py-12 text-[#77817C]">
      No other users found yet.
    </p>
  )
)}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}