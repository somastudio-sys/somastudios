import {
  fetchPodcastFeed,
  getPodcastChannelUrl,
  getPodcastPlayerEmbed,
  getPodcastRssUrl,
} from "@/lib/podcastFeed";

function formatEpisodeDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function PodcastFeed() {
  const rssUrl = getPodcastRssUrl();
  const channelUrl = getPodcastChannelUrl();
  const feed = rssUrl ? await fetchPodcastFeed(rssUrl) : null;
  const { embedSrc } = await getPodcastPlayerEmbed();

  if (!feed && !channelUrl) return null;

  const listenUrl = channelUrl || feed?.link;

  return (
    <section id="podcast" className="podcast-section info-section info-section--soft">
      <div className="podcast-inner">
        <header className="podcast-header">
          <span className="podcast-kicker">Podcast</span>
          <h2>{feed?.title || "Listen on Spotify"}</h2>
          {feed?.description ? (
            <p className="podcast-lede">{feed.description}</p>
          ) : (
            <p className="podcast-lede">
              Dream-adjacent conversations and stories from Soma Studios.
            </p>
          )}
          {listenUrl ? (
            <a
              href={listenUrl}
              className="btn btn-primary podcast-channel-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open on Spotify
            </a>
          ) : null}
        </header>

        {embedSrc ? (
          <div className="podcast-embed-wrap">
            <iframe
              title={`${feed?.title || "Soma"} on Spotify`}
              src={embedSrc}
              width="100%"
              height="352"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="podcast-embed"
            />
          </div>
        ) : null}

        {feed && feed.episodes.length > 0 ? (
          <div className="podcast-episodes">
            <h3 className="podcast-episodes-heading">Latest episodes</h3>
            <ul className="podcast-episode-list">
              {feed.episodes.map((episode) => (
                <li key={episode.id} className="podcast-episode-card">
                  <div className="podcast-episode-meta">
                    {episode.publishedAt ? (
                      <time dateTime={episode.publishedAt}>
                        {formatEpisodeDate(episode.publishedAt)}
                      </time>
                    ) : null}
                  </div>
                  <h4 className="podcast-episode-title">
                    <a
                      href={episode.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {episode.title}
                    </a>
                  </h4>
                  {episode.summary ? (
                    <p className="podcast-episode-summary">{episode.summary}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
