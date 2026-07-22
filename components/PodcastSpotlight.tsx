import {
  getPodcastChannelUrl,
  getPodcastPlayerEmbed,
} from "@/lib/podcastFeed";

const SHOW_TITLE = "Soma Studios: The Dream Experiment";
const SHOW_DESCRIPTION =
  "AI dream analysis, out loud. Each episode takes a real dream, unpacks it with Freudian thinking, then reshapes it into a genre story and a choose-your-own journey.";

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

export default async function PodcastSpotlight() {
  const spotifyUrl = getPodcastChannelUrl();
  const { embedSrc, episode } = await getPodcastPlayerEmbed();
  const episodeDate = episode?.publishedAt
    ? formatEpisodeDate(episode.publishedAt)
    : "";

  return (
    <section
      id="podcast"
      className="info-section info-section--alt podcast-spotlight-section"
      aria-labelledby="podcast-spotlight-heading"
    >
      <div className="podcast-spotlight-inner">
        <header className="podcast-spotlight-header">
          <span className="podcast-kicker">Podcast</span>
          <h2 id="podcast-spotlight-heading">{SHOW_TITLE}</h2>
          <p className="podcast-spotlight-lede">{SHOW_DESCRIPTION}</p>
        </header>

        <article className="podcast-spotlight-card">
          {episode ? (
            <div className="podcast-spotlight-latest">
              <p className="podcast-spotlight-latest-label">Latest episode</p>
              <h3 className="podcast-spotlight-latest-title">
                {episode.link && episode.link !== spotifyUrl ? (
                  <a
                    href={episode.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {episode.title}
                  </a>
                ) : (
                  episode.title
                )}
              </h3>
              {episodeDate ? (
                <p className="podcast-spotlight-latest-date">
                  <time dateTime={episode.publishedAt}>{episodeDate}</time>
                </p>
              ) : null}
            </div>
          ) : null}

          {embedSrc ? (
            <div className="podcast-spotlight-embed-wrap">
              <iframe
                title={
                  episode
                    ? `${episode.title} on Spotify`
                    : `${SHOW_TITLE} on Spotify`
                }
                src={embedSrc}
                width="100%"
                height="352"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="podcast-embed"
              />
            </div>
          ) : null}

          <div className="podcast-spotlight-actions">
            <a
              href={episode?.link || spotifyUrl}
              className="btn btn-primary podcast-spotlight-cta"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="podcast-spotlight-cta-icon" aria-hidden="true">
                <SpotifyIcon />
              </span>
              Listen on Spotify
            </a>
            <p className="podcast-spotlight-note">
              Follow the show for new episodes—dreams read, analysed, and turned
              into stories.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}

function SpotifyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}
