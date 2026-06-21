import type { Metadata } from "next";
import Link from "next/link";
import BlogShell from "@/components/BlogShell";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Ideas and updates from Soma Studios—dreams, creativity, and building a softer home for what you see at night.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <BlogShell backHref="/" backLabel="← Home">
      <header className="marketing-blog-hero">
        <div className="marketing-blog-hero-inner">
          <h1 className="marketing-blog-h1">Journal</h1>
          <p className="marketing-blog-dek">
            Ideas, updates, and how we think about dreams and creativity—so you
            can see what Soma stands for before you open the diary.
          </p>
        </div>
      </header>

      <main className="marketing-blog-main">
        {posts.length === 0 ? (
          <div className="blog-empty">
            <p>No posts yet.</p>
            <p className="blog-empty-hint">
              Add a <code>.md</code> file to <code>content/blog/</code> — see{" "}
              <code>content/blog/README.md</code> for instructions.
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
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    {post.excerpt ? (
                      <p className="marketing-post-excerpt">{post.excerpt}</p>
                    ) : null}
                  </header>
                  <p className="blog-index-read-more">
                    <Link href={`/blog/${post.slug}`}>Read article →</Link>
                  </p>
                </article>
              </li>
            ))}
          </ul>
        )}

        <p className="marketing-blog-cta">
          <Link href="/login" className="btn btn-primary">
            Log in to diary
          </Link>
        </p>
      </main>
    </BlogShell>
  );
}
