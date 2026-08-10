import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  const paths: { path: string; priority: number; lastModified?: Date }[] = [
    { path: "", priority: 1 },
    { path: "/ai-dream-analysis", priority: 0.9 },
    { path: "/dream-analysis-podcast", priority: 0.9 },
    { path: "/blog", priority: 0.85 },
    { path: "/privacy", priority: 0.4 },
    { path: "/terms", priority: 0.4 },
  ];

  const posts = getAllPosts().map((post) => ({
    path: `/blog/${post.slug}`,
    priority: 0.75,
    lastModified: new Date(post.publishedAt),
  }));

  return [...paths, ...posts].map(({ path, priority, lastModified }) => ({
    url: `${base}${path}`,
    lastModified: lastModified ?? new Date(),
    changeFrequency: "weekly" as const,
    priority,
  }));
}
