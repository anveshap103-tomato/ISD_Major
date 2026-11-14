import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPersonalizedFeed } from '../services/feed.api';

export default function FeedPage() {
  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadFeed = async () => {
      try {
        const data = await getPersonalizedFeed();
        setFeed(data.data || data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load your feed.');
      } finally {
        setLoading(false);
      }
    };

    loadFeed();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return <div className="p-10 text-center">Loading your feed...</div>;
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;

  const interests = feed?.interests || [];
  const content = feed?.recommendedContent || [];
  const creators = feed?.suggestedCreators || [];

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-gray-900">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b bg-white px-6 py-4">
        <h1 className="text-2xl font-bold">Ryth Core</h1>
        <nav className="flex flex-wrap items-center gap-4 text-sm">
          <Link to="/creators">Creators</Link>
          <Link to="/content">Content Hub</Link>
          <Link to="/connections">Connections</Link>
          <button onClick={logout} className="rounded-lg bg-gray-900 px-4 py-2 text-white">
            Logout
          </button>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-6 py-10">
        <section>
          <h2 className="text-3xl font-bold">Your personalized feed</h2>
          <p className="mt-2 text-gray-600">Discover ideas and people based on your interests.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {interests.map((interest, index) => (
              <span key={interest.id || index} className="rounded-full bg-white px-4 py-2 text-sm shadow-sm">
                {interest.name || interest}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-5 text-2xl font-bold">Recommended for you</h2>
          {content.length === 0 ? (
            <p className="text-gray-500">No recommendations available yet.</p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {content.map((item) => (
                <article key={item.id} className="rounded-2xl border bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase text-indigo-600">
                    {item.category?.name || item.type || 'Recommended'}
                  </p>
                  <h3 className="mt-3 text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noreferrer" className="mt-4 inline-block font-semibold text-indigo-600">
                      Explore content →
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-5 text-2xl font-bold">Creators you may like</h2>
          {creators.length === 0 ? (
            <p className="text-gray-500">No creator suggestions available yet.</p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {creators.map((creator) => (
                <article key={creator.id} className="rounded-2xl border bg-white p-5 shadow-sm">
                  <h3 className="font-bold">{creator.name}</h3>
                  <p className="mt-2 text-sm text-gray-600">{creator.category || 'Creator'}</p>
                  <p className="mt-2 text-sm text-gray-500">{creator.bio || creator.headline || ''}</p>
                  <Link to={`/creators/${creator.id}`} className="mt-4 inline-block font-semibold text-indigo-600">
                    View profile →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}