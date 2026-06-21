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

export function spotifyEmbedSrc(channelUrl: string): string | null {
  const match = channelUrl.match(/open\.spotify\.com\/show\/([a-zA-Z0-9]+)/);
  if (!match) return null;
  return `https://open.spotify.com/embed/show/${match[1]}?utm_source=generator`;
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
