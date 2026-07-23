import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/blog",
        destination: "/dream-journal",
        permanent: true,
      },
      {
        source: "/blog/:slug",
        destination: "/dream-journal/:slug",
        permanent: true,
      },
      {
        source: "/blog/rss.xml",
        destination: "/dream-journal/rss.xml",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
