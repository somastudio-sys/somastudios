import type { Metadata } from "next";
import Link from "next/link";
import BlogCtaCard from "@/components/BlogCtaCard";
import BlogShell from "@/components/BlogShell";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles on AI dream analysis, Freudian dream interpretation, and keeping a private dream journal — from Soma Studios.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog | Soma Studios",
    description:
      "Ideas on dreams, Freudian analysis, and building a private AI dream diary.",
    url: "/blog",
  },
};

function formatCardDate(iso: string): string {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    .toUpperCase();
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <BlogShell>
      <header className="blog-index-hero">
        <div className="blog-index-hero-inner">
          <p className="blog-index-kicker">Soma Studios</p>
          <h1 className="blog-index-h1">Blog</h1>
          <p className="blog-index-dek">
            Writing on AI dream analysis, Freudian interpretation, and how to
            keep a private dream diary.
          </p>
        </div>
      </header>

      <div className="blog-index-layout">
        <main className="blog-index-main">
          {posts.length === 0 ? (
            <div className="blog-empty blog-index-empty">
              <p>New articles are on the way.</p>
              <p className="blog-empty-hint">
                Meanwhile, try the{" "}
                <Link href="/ai-dream-analysis">AI dream analysis app</Link> or
                listen to the{" "}
                <Link href="/dream-analysis-podcast">
                  dream analysis podcast
                </Link>
                .
              </p>
            </div>
          ) : (
            <ul className="blog-card-list">
              {posts.map((post) => (
                <li key={post.slug}>
                  <article className="blog-card">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="blog-card-media"
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      {post.image ? (
                        <img src={post.image} alt="" />
                      ) : (
                        <span className="blog-card-media-fallback" />
                      )}
                    </Link>
                    <div className="blog-card-body">
                      <p className="blog-card-meta">
                        <span className="blog-card-category">
                          {post.category}
                        </span>
                        <time dateTime={post.publishedAt}>
                          {formatCardDate(post.publishedAt)}
                        </time>
                      </p>
                      <h2 className="blog-card-title">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
                      {post.excerpt ? (
                        <p className="blog-card-excerpt">{post.excerpt}</p>
                      ) : null}
                      <p className="blog-card-read-more">
                        <Link href={`/blog/${post.slug}`}>Read more</Link>
                      </p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </main>

        <aside className="blog-index-aside" aria-label="Get started">
          <BlogCtaCard />
        </aside>
      </div>
    </BlogShell>
  );
}
