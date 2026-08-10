import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dream-journal",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/dream-journal/:slug",
        destination: "/blog/:slug",
        permanent: true,
      },
      {
        source: "/dream-journal/rss.xml",
        destination: "/blog/rss.xml",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
