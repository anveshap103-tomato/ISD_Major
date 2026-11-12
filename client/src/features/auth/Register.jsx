import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const interests = [
  'Technology',
  'Design',
  'Business',
  'Content Creation',
  'AI & ML',
  'Entrepreneurship',
];

export default function Register() {
    const navigate = useNavigate();

const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [selectedInterests, setSelectedInterests] = useState([]);
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);

const handleInterestChange = (interest) => {
  setSelectedInterests((prev) =>
    prev.includes(interest)
      ? prev.filter((item) => item !== interest)
      : [...prev, interest]
  );
};

const handleRegister = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const response = await fetch(
      'http://localhost:5001/api/auth/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          interests: selectedInterests,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || 'Registration failed');
    }

    localStorage.setItem('token', result.data.token);
    localStorage.setItem('user', JSON.stringify(result.data.user));

    navigate('/onboarding');
  } catch (err) {
    setError(err.message || 'Something went wrong');
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen w-full bg-[#F7F5EF] flex items-center justify-center p-5">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-sm border border-[#EAE7DF]">

        {/* Left Section */}
        <div className="hidden md:flex flex-col justify-between bg-[#EAEFE8] p-12">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#246B52] flex items-center justify-center text-white font-bold">
                R
              </div>
              <span className="text-xl font-semibold text-[#244D3D]">
                Ryth Core
              </span>
            </div>

            <div className="mt-20">
              <p className="text-sm uppercase tracking-[3px] text-[#49735D]">
                Join the community
              </p>

              <h1 className="mt-5 text-5xl font-serif text-[#244D3D] leading-tight">
                Grow
                <br />
                together.
                <br />
                <span className="italic">Go further.</span>
              </h1>

              <p className="mt-6 text-[#66766B] leading-7 max-w-sm">
                Create your profile, discover people with
                shared interests, and start building
                meaningful connections.
              </p>
            </div>
          </div>

          <p className="text-sm text-[#66766B]">
            A community built around growth.
          </p>
        </div>

        {/* Right Section */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="md:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-full bg-[#246B52] flex items-center justify-center text-white font-bold">
              R
            </div>
            <span className="text-xl font-semibold text-[#244D3D]">
              Ryth Core
            </span>
          </div>

          <div>
            <p className="text-sm font-medium text-[#246B52]">
              GET STARTED
            </p>

            <h2 className="mt-3 text-3xl sm:text-4xl font-serif text-[#244D3D]">
              Create your account
            </h2>

            <p className="mt-3 text-[#7A817B] text-sm leading-6">
              Join Ryth Core and find your community.
            </p>
          </div>

        <form
            className="mt-7 space-y-5"
            onSubmit={handleRegister}
            >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#34483B] mb-2">
                Full Name
              </label>
<input
  id="name"
  type="text"
  value={name}
  onChange={(e) => setName(e.target.value)}
  placeholder="Your full name"
  required
  className="w-full px-4 py-3.5 rounded-xl border border-[#E3E5DF] bg-[#FCFCFA] text-sm focus:outline-none focus:border-[#246B52] focus:ring-2 focus:ring-[#246B52]/10 transition"
/>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#34483B] mb-2">
                Email Address
              </label>
<input
  id="email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="you@example.com"
  required
  className="w-full px-4 py-3.5 rounded-xl border border-[#E3E5DF] bg-[#FCFCFA] text-sm focus:outline-none focus:border-[#246B52] focus:ring-2 focus:ring-[#246B52]/10 transition"
/>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#34483B] mb-2">
                Password
              </label>
<input
  id="password"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Create a password"
  required
  minLength={8}
  className="w-full px-4 py-3.5 rounded-xl border border-[#E3E5DF] bg-[#FCFCFA] text-sm focus:outline-none focus:border-[#246B52] focus:ring-2 focus:ring-[#246B52]/10 transition"
/>
              <p className="mt-2 text-xs text-[#9A9E98]">
                Use at least 8 characters.
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-[#34483B] mb-3">
                Choose your interests
              </p>

              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <label
                    key={interest}
                    className="cursor-pointer"
                  >
<input
  type="checkbox"
  name="interests"
  value={interest}
  checked={selectedInterests.includes(interest)}
  onChange={() => handleInterestChange(interest)}
  className="peer sr-only"
/>
                    <span className="inline-block px-3 py-2 rounded-full border border-[#E3E5DF] text-xs text-[#66766B] peer-checked:bg-[#EAEFE8] peer-checked:border-[#246B52] peer-checked:text-[#246B52] transition">
                      {interest}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            {error && (
  <p className="text-sm text-red-600">
    {error}
  </p>
)}

<button
  type="submit"
  disabled={loading}
  className="w-full py-3.5 rounded-xl bg-[#246B52] text-white text-sm font-semibold hover:bg-[#1C5943] transition shadow-sm disabled:opacity-60"
>
  {loading ? 'Creating Account...' : 'Create Account →'}
</button>
          </form>

          <div className="mt-7 text-center">
            <p className="text-sm text-[#7A817B]">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-[#246B52] font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-8 text-center text-xs text-[#A0A59F]">
            © 2026 Ryth Core. Built for meaningful connections.
          </p>
        </div>
      </div>
    </div>
  );
}
