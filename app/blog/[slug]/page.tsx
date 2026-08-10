import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogCtaCard from "@/components/BlogCtaCard";
import BlogPodcastEmbed from "@/components/BlogPodcastEmbed";
import BlogShell from "@/components/BlogShell";
import MarkdownArticle from "@/components/MarkdownArticle";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { extractMarkdownHeadings } from "@/lib/blogHeadings";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt || undefined,
      publishedTime: post.publishedAt,
      url: `/blog/${slug}`,
      ...(post.image ? { images: [{ url: post.image }] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const headings = extractMarkdownHeadings(post.content);
  const podcastSlot = post.content.includes("{{podcast}}") ? (
    <BlogPodcastEmbed />
  ) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: {
      "@type": "Organization",
      name: "Soma Studios",
    },
    mainEntityOfPage: `/blog/${slug}`,
    ...(post.image ? { image: post.image } : {}),
  };

  return (
    <BlogShell backHref="/blog" backLabel="← Blog">
      <div className="blog-post-layout">
        <article
          className="blog-article"
          itemScope
          itemType="https://schema.org/BlogPosting"
        >
          <header className="blog-article-header">
            {post.image ? (
              <div className="blog-article-hero">
                <img
                  src={post.image}
                  alt={post.imageAlt}
                  className="blog-article-hero-image"
                  itemProp="image"
                />
              </div>
            ) : null}
            <p className="blog-article-meta-row">
              <span className="blog-card-category">{post.category}</span>
              <time
                className="marketing-post-date"
                dateTime={post.publishedAt}
                itemProp="datePublished"
              >
                {post.date}
              </time>
            </p>
            <h1 className="blog-article-title" itemProp="headline">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="blog-article-dek" itemProp="description">
                {post.excerpt}
              </p>
            ) : null}
          </header>
          <div itemProp="articleBody">
            <MarkdownArticle content={post.content} podcastSlot={podcastSlot} />
          </div>
        </article>

        <aside className="blog-post-aside" aria-label="Article sidebar">
          {headings.length > 0 ? (
            <nav className="blog-toc" aria-label="On this page">
              <p className="blog-toc-label">On this page</p>
              <ol className="blog-toc-list">
                {headings.map((heading) => (
                  <li
                    key={`${heading.level}-${heading.id}`}
                    className={
                      heading.level === 3 ? "blog-toc-item--sub" : undefined
                    }
                  >
                    <a href={`#${heading.id}`}>{heading.text}</a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
          <BlogCtaCard />
          <p className="blog-post-aside-back">
            <Link href="/blog">← All posts</Link>
          </p>
        </aside>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </BlogShell>
  );
}
