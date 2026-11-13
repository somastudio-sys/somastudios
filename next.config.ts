import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/blog",
        destination: "/",
        permanent: true,
      },
      {
        source: "/blog/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/dream-journal",
        destination: "/",
        permanent: true,
      },
      {
        source: "/dream-journal/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/ai-dream-analysis",
        destination: "/",
        permanent: true,
      },
      {
        source: "/dream-analysis-podcast",
        destination: "/",
        permanent: true,
      },
      {
        source: "/product/dream-journal",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
