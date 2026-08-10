import {
  getPodcastChannelUrl,
  getPodcastPlayerEmbed,
} from "@/lib/podcastFeed";

/** Compact Spotify player for use inside a blog article. */
export default async function BlogPodcastEmbed() {
  const spotifyUrl = getPodcastChannelUrl();
  const { embedSrc, episode } = await getPodcastPlayerEmbed();

  if (!embedSrc) {
    return (
      <p className="blog-podcast-fallback">
        <a href={spotifyUrl} target="_blank" rel="noopener noreferrer">
          Listen to the Soma Studios podcast on Spotify →
        </a>
      </p>
    );
  }

  return (
    <figure className="blog-podcast-embed">
      <iframe
        title={
          episode
            ? `${episode.title} on Spotify`
            : "Soma Studios podcast on Spotify"
        }
        src={embedSrc}
        width="100%"
        height="152"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
      <figcaption>
        Meet Amy and other real dreams on the{" "}
        <a href="/dream-analysis-podcast">Soma Studios podcast</a>
        {episode?.link ? (
          <>
            {" "}
            ·{" "}
            <a href={episode.link} target="_blank" rel="noopener noreferrer">
              Open in Spotify
            </a>
          </>
        ) : null}
      </figcaption>
    </figure>
  );
}
