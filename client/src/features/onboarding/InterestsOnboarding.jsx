
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiBaseUrl } from '../../services/api';
import {
  Laptop,
  Palette,
  BriefcaseBusiness,
  Clapperboard,
  BrainCircuit,
  Rocket,
} from 'lucide-react';

const interestOptions = [
  {
    name: 'Technology',
    icon: Laptop,
    color: 'bg-blue-50',
    description: 'Explore technology and innovation',
  },
  {
    name: 'Design',
    icon: Palette,
    color: 'bg-pink-50',
    description: 'Create beautiful experiences',
  },
  {
    name: 'Business',
    icon: BriefcaseBusiness,
    color: 'bg-amber-50',
    description: 'Understand markets and strategy',
  },
  {
    name: 'Content Creation',
    icon: Clapperboard,
    color: 'bg-orange-50',
    description: 'Create and share your ideas',
  },
  {
    name: 'AI & ML',
    icon: BrainCircuit,
    color: 'bg-purple-50',
    description: 'Discover artificial intelligence',
  },
  {
    name: 'Entrepreneurship',
    icon: Rocket,
    color: 'bg-green-50',
    description: 'Build something of your own',
  },
];

export default function InterestsOnboarding() {
  const navigate = useNavigate();

  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const token = localStorage.getItem('token');

        const baseUrl = getApiBaseUrl();
        const [interestsResponse, profileResponse] = await Promise.all([
          fetch(`${baseUrl}/users/interests`),
          fetch(`${baseUrl}/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const interestsResult = await interestsResponse.json();
        const profileResult = await profileResponse.json();

        if (!interestsResponse.ok || !profileResponse.ok) {
          throw new Error('Failed to load interests');
        }

        setSelectedInterests(
          profileResult.data.user.userInterests.map(
            (item) => item.interest.name
          )
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInterests();
  }, []);

  const handleInterestChange = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const handleContinue = async () => {
    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${getApiBaseUrl()}/users/me/interests`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            interests: selectedInterests,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error?.message || 'Failed to save interests'
        );
      }

      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F5EF]">
        Loading your interests...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF] px-5 py-10 sm:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <header className="flex items-center gap-3 mb-12">
          <div className="w-11 h-11 rounded-full bg-[#246B52] flex items-center justify-center text-white text-xl font-bold">
            R
          </div>

          <span className="text-2xl font-semibold text-[#244D3D]">
            Ryth Core
          </span>
        </header>

        {/* Heading */}
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-[3px] text-[#246B52]">
            PERSONALIZE YOUR EXPERIENCE
          </p>

          <h1 className="mt-5 text-3xl sm:text-5xl font-serif text-[#244D3D]">
            What are you passionate about?
          </h1>

          <p className="mt-4 text-sm sm:text-base text-[#7A817B] leading-7">
            Choose the topics that interest you. We'll help you discover
            people who share your curiosity.
          </p>

          <p className="mt-3 text-xs text-[#9A9E98]">
            CHOOSE YOUR INTERESTS
          </p>
        </div>

        {/* Interest Cards */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {interestOptions.map((interest) => {
            const selected = selectedInterests.includes(interest.name);
            const InterestIcon = interest.icon;

            return (
              <label
                key={interest.name}
                className={`relative cursor-pointer rounded-2xl border-2 p-5 sm:p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                  selected
                    ? 'border-[#246B52] bg-[#F0F5EF] shadow-sm'
                    : 'border-[#EAE7DF] bg-white hover:border-[#A7BBAE]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => handleInterestChange(interest.name)}
                  className="sr-only"
                />

                {selected && (
                  <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#246B52] text-white flex items-center justify-center text-xs">
                    ✓
                  </span>
                )}

                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${interest.color} flex items-center justify-center`}
                >
                  <InterestIcon
                    size={38}
                    strokeWidth={1.7}
                    className="text-[#246B52]"
                  />
                </div>

                <h3 className="mt-5 text-base sm:text-lg font-semibold text-[#244D3D]">
                  {interest.name}
                </h3>

                <p className="mt-2 text-xs sm:text-sm leading-5 text-[#849087]">
                  {interest.description}
                </p>
              </label>
            );
          })}
        </div>

        {/* Continue Section */}
        <div className="max-w-2xl mx-auto mt-10">
          <p className="text-center text-sm text-[#7A817B]">
            {selectedInterests.length} of 6 interests selected
          </p>

          {error && (
            <p className="mt-4 text-center text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            onClick={handleContinue}
            disabled={saving}
            className="mt-6 w-full py-4 rounded-xl bg-[#246B52] text-white text-sm font-semibold hover:bg-[#1C5943] transition disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Continue →'}
          </button>

          <p className="mt-5 text-center text-xs text-[#9A9E98]">
            You can update your interests anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
