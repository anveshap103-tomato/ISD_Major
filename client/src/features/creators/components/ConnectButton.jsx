import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useConnectionStatus from '../hooks/useConnectionStatus.js';

/**
 * Reusable ConnectButton for CreatorCard and ProfileHeader.
 *
 * @param {Object} props
 * @param {string} props.userId - Target creator User ID (User.id, not CreatorProfile.id)
 * @param {string} props.creatorName - Display name for accessibility & alerts
 * @param {string} [props.variant='card'] - 'card' | 'profile'
 * @param {Object} [props.connectionsData=null] - Pre-fetched user connections
 * @param {Function} [props.onStatusChange] - Optional status change callback
 */
export default function ConnectButton({
  userId,
  creatorName,
  variant = 'card',
  connectionsData = null,
  onStatusChange = null,
  onActionSuccess = null,
}) {
  const navigate = useNavigate();
  const {
    status,
    isSending,
    isAuthenticated,
    handleConnect,
    handleAccept,
    error,
  } = useConnectionStatus(userId, connectionsData, onStatusChange);

  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const handleClick = async (e) => {
    e.stopPropagation(); // Prevent card container navigation
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (status === 'PENDING_RECEIVED') {
      const res = await handleAccept();
      if (res?.success) {
        setFeedbackMessage('Connected!');
        setTimeout(() => setFeedbackMessage(null), 3000);
        if (onActionSuccess) onActionSuccess();
      }
      return;
    }

    if (status === 'IDLE') {
      const res = await handleConnect();
      if (res?.success) {
        setFeedbackMessage('Request sent!');
        setTimeout(() => setFeedbackMessage(null), 3000);
        if (onActionSuccess) onActionSuccess();
      }
    }
  };

  // 1. Own profile: Return disabled "You" indicator
  if (status === 'SELF') {
    if (variant === 'profile') {
      return (
        <span
          className="inline-flex items-center justify-center gap-1.5 px-5 h-11 rounded-xl text-xs sm:text-sm font-semibold bg-[#F8F7F2] text-[#5A6561] border border-[#E5E3DC] cursor-default"
          title="This is your own profile"
        >
          <span>Your Profile</span>
        </span>
      );
    }
    return (
      <span
        className="inline-flex items-center justify-center px-3 min-h-[44px] rounded-xl text-xs font-medium bg-[#F8F7F2] text-[#5A6561] border border-[#E5E3DC]"
      >
        You
      </span>
    );
  }

  // 2. Already Connected
  if (status === 'CONNECTED') {
    const isProfile = variant === 'profile';
    return (
      <div className="relative inline-flex flex-col items-center">
        <button
          type="button"
          disabled
          aria-label={`Connected with ${creatorName}`}
          className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold border transition-all cursor-default select-none ${
            isProfile
              ? 'min-h-[44px] px-6 text-sm bg-[#EBF3EE] text-[#28634F] border-[#28634F]/30'
              : 'min-h-[44px] px-3.5 text-xs bg-[#EBF3EE] text-[#28634F] border-[#28634F]/30'
          }`}
        >
          <svg className="w-4 h-4 text-[#28634F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>Connected</span>
        </button>
      </div>
    );
  }

  // 3. Pending Sent (Request sent by current user)
  if (status === 'PENDING_SENT') {
    const isProfile = variant === 'profile';
    return (
      <div className="relative inline-flex flex-col items-center">
        <button
          type="button"
          disabled
          aria-label={`Connection request sent to ${creatorName}`}
          className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold border transition-all cursor-default select-none ${
            isProfile
              ? 'min-h-[44px] px-6 text-sm bg-[#F8F7F2] text-[#5A6561] border-[#E5E3DC]'
              : 'min-h-[44px] px-3.5 text-xs bg-[#F8F7F2] text-[#5A6561] border-[#E5E3DC]'
          }`}
        >
          <svg className="w-3.5 h-3.5 text-[#5A6561]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Pending</span>
        </button>
      </div>
    );
  }

  // 4. Pending Received (Creator sent current user a request)
  if (status === 'PENDING_RECEIVED') {
    const isProfile = variant === 'profile';
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isSending}
        aria-label={`Accept connection request from ${creatorName}`}
        style={{ backgroundColor: '#28634F', color: '#FFFFFF' }}
        className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#28634F] cursor-pointer touch-manipulation active:scale-[0.98] ${
          isProfile
            ? 'min-h-[44px] px-6 text-sm bg-[#28634F] hover:bg-[#1E4D3D] text-white'
            : 'min-h-[44px] px-3.5 text-xs bg-[#28634F] hover:bg-[#1E4D3D] text-white'
        } ${isSending ? 'opacity-70 cursor-wait' : ''}`}
      >
        {isSending ? (
          <>
            <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>Accepting...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>Accept Request</span>
          </>
        )}
      </button>
    );
  }

  // 5. Unauthenticated: Prompt sign in
  if (status === 'UNAUTHENTICATED') {
    const isProfile = variant === 'profile';
    return (
      <button
        type="button"
        onClick={handleClick}
        title="Sign in to connect"
        aria-label={`Sign in to connect with ${creatorName}`}
        className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold border transition-all cursor-pointer touch-manipulation hover:border-[#28634F] text-[#28634F] bg-white ${
          isProfile
            ? 'min-h-[44px] px-6 text-sm border-[#DCE8E0] hover:bg-[#EBF3EE]'
            : 'min-h-[44px] px-3.5 text-xs border-[#DCE8E0] hover:bg-[#EBF3EE]'
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        <span>Sign in to Connect</span>
      </button>
    );
  }

  // 6. Default: Idle state ("Connect")
  const isProfile = variant === 'profile';
  return (
    <div className="relative inline-flex flex-col items-start sm:items-center">
      <button
        type="button"
        onClick={handleClick}
        disabled={isSending}
        aria-label={`Connect with ${creatorName}`}
        style={{ backgroundColor: '#28634F', color: '#FFFFFF' }}
        className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#28634F] cursor-pointer touch-manipulation active:scale-[0.98] ${
          isProfile
            ? 'w-full sm:w-auto min-h-[44px] px-6 text-sm bg-[#28634F] hover:bg-[#1E4D3D] text-white'
            : 'min-h-[44px] px-3.5 text-xs bg-[#28634F] hover:bg-[#1E4D3D] text-white'
        } ${isSending ? 'opacity-70 cursor-wait' : ''}`}
      >
        {isSending ? (
          <>
            <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span>Connect</span>
          </>
        )}
      </button>

      {/* Accessible inline toast message positioned cleanly above button so card borders never clip */}
      {feedbackMessage && (
        <span
          role="status"
          className="absolute bottom-full mb-2 left-0 whitespace-nowrap text-[11px] font-semibold text-[#28634F] bg-[#EBF3EE] px-2.5 py-1 rounded-lg shadow-sm border border-[#C5DACE] z-10 pointer-events-none"
        >
          {feedbackMessage}
        </span>
      )}

      {/* Inline error feedback positioned cleanly above button */}
      {error && !feedbackMessage && (
        <span
          role="alert"
          className="absolute bottom-full mb-2 left-0 max-w-[220px] text-[11px] font-semibold text-[#B84E3C] bg-[#FCEEEA] px-2.5 py-1 rounded-lg shadow-sm border border-[#EACEC7] z-10 pointer-events-none"
        >
          {error}
        </span>
      )}
    </div>
  );
}

