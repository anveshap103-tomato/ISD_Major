const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
  'youtu.be',
  'www.youtu.be',
]);

const getYouTubeEmbedUrl = (value) => {
  try {
    const videoUrl = new URL(value);
    if (videoUrl.protocol !== 'https:' || !YOUTUBE_HOSTS.has(videoUrl.hostname.toLowerCase())) {
      return null;
    }

    const pathParts = videoUrl.pathname.split('/').filter(Boolean);
    const videoId = videoUrl.hostname.toLowerCase().endsWith('youtu.be')
      ? pathParts[0]
      : videoUrl.pathname === '/watch'
        ? videoUrl.searchParams.get('v')
        : ['embed', 'shorts', 'live'].includes(pathParts[0])
          ? pathParts[1]
          : null;

    if (!videoId || !/^[A-Za-z0-9_-]{11}$/.test(videoId)) return null;
    return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;
  } catch {
    return null;
  }
};

export default function ContentVideoPlayer({ url, title }) {
  const embedUrl = getYouTubeEmbedUrl(url);
  if (!embedUrl) return null;

  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-[#E5E3DC] bg-black">
      <div className="aspect-video w-full">
        <iframe
          src={embedUrl}
          title={`Play video: ${title}`}
          className="h-full w-full"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}
