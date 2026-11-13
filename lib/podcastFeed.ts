import Parser from "rss-parser";

export type PodcastEpisode = {
  id: string;
  title: string;
  link: string;
  publishedAt: string;
  summary: string;
};

export type PodcastFeed = {
  title: string;
  description: string;
  link: string;
  episodes: PodcastEpisode[];
};

const parser = new Parser({
  customFields: {
    item: [["itunes:duration", "duration"]],
  },
});

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function excerpt(text: string, max = 160): string {
  const clean = stripHtml(text);
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trim()}…`;
}

export const DEFAULT_PODCAST_SPOTIFY_URL =
  "https://open.spotify.com/show/49Bw4yuSpAVD34m7xwHLy8";

export function getPodcastRssUrl(): string {
  return (
    process.env.PODCAST_RSS_URL?.trim() ||
    process.env.NEXT_PUBLIC_PODCAST_RSS_URL?.trim() ||
    ""
  );
}

export function getPodcastChannelUrl(): string {
  return process.env.NEXT_PUBLIC_PODCAST_URL?.trim() || DEFAULT_PODCAST_SPOTIFY_URL;
}

export function parseSpotifyShowId(channelUrl: string): string | null {
  const match = channelUrl.match(/open\.spotify\.com\/show\/([a-zA-Z0-9]+)/);
  return match?.[1] ?? null;
}

export function parseSpotifyEpisodeId(value: string): string | null {
  const match = value.match(
    /(?:open\.spotify\.com\/episode\/|spotify:episode:)([a-zA-Z0-9]+)/
  );
  return match?.[1] ?? null;
}

export function spotifyShowEmbedSrc(showId: string): string {
  return `https://open.spotify.com/embed/show/${showId}?utm_source=generator&theme=0`;
}

export function spotifyEpisodeEmbedSrc(episodeId: string): string {
  return `https://open.spotify.com/embed/episode/${episodeId}?utm_source=generator&theme=0`;
}

export function spotifyEmbedSrc(channelUrl: string): string | null {
  const showId = parseSpotifyShowId(channelUrl);
  if (!showId) return null;
  return spotifyShowEmbedSrc(showId);
}

export type LatestPodcastEpisode = {
  title: string;
  publishedAt: string;
  spotifyEpisodeId: string | null;
  link: string;
};

function episodeIdFromRssItem(item: {
  link?: string;
  guid?: string;
  enclosure?: { url?: string };
  content?: string;
  contentSnippet?: string;
  summary?: string;
}): string | null {
  const candidates = [
    item.link,
    typeof item.guid === "string" ? item.guid : undefined,
    item.enclosure?.url,
    item.content,
    item.contentSnippet,
    item.summary,
  ];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const id = parseSpotifyEpisodeId(candidate);
    if (id) return id;
  }
  return null;
}

async function fetchLatestSpotifyEpisodeFromShowEmbed(
  showId: string
): Promise<{ id: string; title: string } | null> {
  try {
    const res = await fetch(spotifyShowEmbedSrc(showId), {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const id = parseSpotifyEpisodeId(html);
    if (!id) return null;
    const nameMatch = html.match(/"name":"((?:\\.|[^"\\]){3,200})"/);
    const title = nameMatch
      ? nameMatch[1]
          .replace(/\\"/g, '"')
          .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
            String.fromCharCode(parseInt(hex, 16))
          )
          .trim()
      : "Latest episode";
    return { id, title };
  } catch {
    return null;
  }
}

export async function fetchLatestPodcastEpisode(): Promise<LatestPodcastEpisode | null> {
  const rssUrl = getPodcastRssUrl();
  const channelUrl = getPodcastChannelUrl();
  const showId = parseSpotifyShowId(channelUrl);

  if (rssUrl) {
    try {
      const feed = await parser.parseURL(rssUrl);
      const items = [...(feed.items ?? [])].sort((a, b) => {
        const aTime = new Date(a.isoDate || a.pubDate || 0).getTime();
        const bTime = new Date(b.isoDate || b.pubDate || 0).getTime();
        return bTime - aTime;
      });
      const latest = items[0];
      if (latest) {
        let spotifyEpisodeId = episodeIdFromRssItem(latest);
        if (!spotifyEpisodeId && showId) {
          const fromSpotify = await fetchLatestSpotifyEpisodeFromShowEmbed(showId);
          spotifyEpisodeId = fromSpotify?.id ?? null;
        }
        return {
          title: latest.title?.trim() || "Latest episode",
          publishedAt: latest.isoDate || latest.pubDate || "",
          spotifyEpisodeId,
          link: latest.link?.trim() || channelUrl,
        };
      }
    } catch {
      // Fall through to Spotify embed lookup.
    }
  }

  if (!showId) return null;

  const fromSpotify = await fetchLatestSpotifyEpisodeFromShowEmbed(showId);
  if (!fromSpotify) return null;

  return {
    title: fromSpotify.title,
    publishedAt: "",
    spotifyEpisodeId: fromSpotify.id,
    link: `https://open.spotify.com/episode/${fromSpotify.id}`,
  };
}

export async function getPodcastPlayerEmbed(): Promise<{
  embedSrc: string | null;
  episode: LatestPodcastEpisode | null;
}> {
  const channelUrl = getPodcastChannelUrl();
  const showId = parseSpotifyShowId(channelUrl);
  const episode = await fetchLatestPodcastEpisode();

  if (episode?.spotifyEpisodeId) {
    return {
      embedSrc: spotifyEpisodeEmbedSrc(episode.spotifyEpisodeId),
      episode,
    };
  }

  return {
    embedSrc: showId ? spotifyShowEmbedSrc(showId) : spotifyEmbedSrc(channelUrl),
    episode,
  };
}

export async function fetchPodcastFeed(
  rssUrl: string,
  limit = 8
): Promise<PodcastFeed | null> {
  if (!rssUrl) return null;

  try {
    const feed = await parser.parseURL(rssUrl);
    const channelLink = feed.link?.trim() || getPodcastChannelUrl();
    const episodes: PodcastEpisode[] = (feed.items ?? [])
      .slice(0, limit)
      .map((item, index) => {
        const link =
          item.link?.trim() ||
          (item.enclosure?.url as string | undefined)?.trim() ||
          channelLink;
        return {
          id: item.guid || item.link || `${item.title}-${index}`,
          title: item.title?.trim() || "Untitled episode",
          link,
          publishedAt: item.isoDate || item.pubDate || "",
          summary: excerpt(item.contentSnippet || item.content || item.summary || ""),
        };
      })
      .filter((episode) => episode.link);

    return {
      title: feed.title?.trim() || "Podcast",
      description: excerpt(feed.description || "", 220),
      link: channelLink,
      episodes,
    };
  } catch {
    return null;
  }
}
