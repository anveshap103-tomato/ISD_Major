import { useMemo, useState } from 'react';
import Navbar from '../../../components/layout/Navbar';
import ContentCard from '../components/ContentCard';
import ContentFilters from '../components/ContentFilters';
import { MOCK_CONTENT } from '../data/mockContent';

export default function ContentHubPage() {
  const [activeType, setActiveType] = useState('ALL');
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const visibleContent = useMemo(() => MOCK_CONTENT.filter((item) => {
    const matchesType = activeType === 'ALL' || item.type === activeType;
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [item.title, item.description, item.author, item.category].join(' ').toLowerCase().includes(query);
    return matchesType && matchesCategory && matchesSearch;
  }), [activeType, activeCategory, search]);

  return (
    <div className="min-h-screen bg-[#F7F5EF]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#28634F]">Knowledge &amp; Content Hub</p>
          <h1 className="mt-3 font-serif text-4xl tracking-tight text-[#192521] sm:text-5xl">Learn what moves you forward.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#5A6561]">Explore thoughtfully selected articles, short videos and books, then find the people already doing the work.</p>
        </section>
        <section className="mt-8 rounded-2xl bg-[#EEF3EF] p-4 sm:p-6">
          <label htmlFor="content-search" className="sr-only">Search content</label>
          <input id="content-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search topics, authors, or resources" className="mb-5 w-full rounded-xl border-0 bg-white px-4 py-3 text-sm text-[#192521] shadow-sm ring-1 ring-[#D9DDD8] outline-none placeholder:text-[#87918D] focus:ring-2 focus:ring-[#28634F]" />
          <ContentFilters activeType={activeType} activeCategory={activeCategory} onTypeChange={setActiveType} onCategoryChange={setActiveCategory} />
        </section>
        <section className="mt-9" aria-live="polite">
          <div className="mb-5 flex items-baseline justify-between"><h2 className="font-serif text-2xl text-[#192521]">Explore resources</h2><span className="text-sm text-[#66736D]">{visibleContent.length} resources</span></div>
          {visibleContent.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{visibleContent.map((item) => <ContentCard key={item.id} item={item} />)}</div> : <div className="rounded-2xl bg-white p-10 text-center text-[#5A6561] shadow-sm ring-1 ring-[#E5E3DC]">No resources match those filters. Try another search or category.</div>}
        </section>
      </main>
    </div>
  );
}
