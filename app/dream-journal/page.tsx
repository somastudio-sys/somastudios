import type { Metadata } from "next";
import Link from "next/link";
import BlogShell from "@/components/BlogShell";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Dream Journal Blog",
  description:
    "Articles on AI dream analysis, Freudian dream interpretation, and keeping a private dream journal — from Soma Studios.",
  alternates: {
    canonical: "/dream-journal",
  },
  openGraph: {
    title: "Dream Journal Blog | Soma Studios",
    description:
      "Ideas on dreams, Freudian analysis, and building a private AI dream diary.",
    url: "/dream-journal",
  },
};

export default function DreamJournalPage() {
  const posts = getAllPosts();

  return (
    <BlogShell backHref="/" backLabel="← Home">
      <header className="marketing-blog-hero">
        <div className="marketing-blog-hero-inner">
          <h1 className="marketing-blog-h1">Dream journal</h1>
          <p className="marketing-blog-dek">
            Writing on AI dream analysis, Freudian interpretation, and how to keep
            a private dream diary — so you can see what Soma stands for before you
            open the app.
          </p>
        </div>
      </header>

      <main className="marketing-blog-main">
        {posts.length === 0 ? (
          <div className="blog-empty">
            <p>New dream journal articles are on the way.</p>
            <p className="blog-empty-hint">
              Meanwhile, try the{" "}
              <Link href="/ai-dream-analysis">AI dream analysis app</Link> or
              listen to the{" "}
              <Link href="/dream-analysis-podcast">dream analysis podcast</Link>.
            </p>
          </div>
        ) : (
          <ul className="marketing-post-list">
            {posts.map((post) => (
              <li key={post.slug} className="marketing-post">
                <article>
                  <header className="marketing-post-header">
                    <time
                      className="marketing-post-date"
                      dateTime={post.publishedAt}
                    >
                      {post.date}
                    </time>
                    <h2>
                      <Link href={`/dream-journal/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>
                    {post.excerpt ? (
                      <p className="marketing-post-excerpt">{post.excerpt}</p>
                    ) : null}
                  </header>
                  <p className="blog-index-read-more">
                    <Link href={`/dream-journal/${post.slug}`}>
                      Read article →
                    </Link>
                  </p>
                </article>
              </li>
            ))}
          </ul>
        )}

        <p className="marketing-blog-cta">
          <Link href="/signup" className="btn btn-primary">
            Start your dream journal
          </Link>
        </p>
      </main>
    </BlogShell>
  );
}
