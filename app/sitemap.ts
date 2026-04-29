import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  const paths: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/blog", priority: 0.85 },
    { path: "/privacy", priority: 0.6 },
    { path: "/terms", priority: 0.6 },
  ];

  return paths.map(({ path, priority }) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority,
  }));
}
