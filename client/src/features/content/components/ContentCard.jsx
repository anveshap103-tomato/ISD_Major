const labels = { ARTICLE: 'Article', VIDEO: 'Video', BOOK: 'Book' };

export default function ContentCard({ item }) {
  const metadata = item.readTime || item.duration || item.isbn;
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#E5E3DC] transition hover:-translate-y-0.5 hover:shadow-md">
      <img src={item.imageUrl} alt="" className="h-44 w-full object-cover" />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wider">
          <span className="text-[#28634F]">{labels[item.type]}</span>
          <span className="text-[#7A8580]">{item.category}</span>
        </div>
        <h2 className="font-serif text-xl leading-tight text-[#192521]">{item.title}</h2>
        <p className="mt-3 text-sm leading-6 text-[#5A6561]">{item.description}</p>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#EFECE3] pt-4 text-xs text-[#66736D]">
          <span>{item.author}</span>
          <span>{metadata}</span>
        </div>
        <a href={item.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-semibold text-[#28634F] hover:text-[#1E4D3D]">
          Explore resource <span aria-hidden="true" className="ml-1">→</span>
        </a>
      </div>
    </article>
  );
}
