import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogShell from "@/components/BlogShell";
import MarkdownArticle from "@/components/MarkdownArticle";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

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
      canonical: `/dream-journal/${slug}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt || undefined,
      publishedTime: post.publishedAt,
      url: `/dream-journal/${slug}`,
    },
  };
}

export default async function DreamJournalPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

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
    mainEntityOfPage: `/dream-journal/${slug}`,
  };

  return (
    <BlogShell backHref="/dream-journal" backLabel="← Dream journal">
      <main className="marketing-blog-main blog-article-page">
        <article
          className="blog-article"
          itemScope
          itemType="https://schema.org/BlogPosting"
        >
          <header className="blog-article-header">
            <time
              className="marketing-post-date"
              dateTime={post.publishedAt}
              itemProp="datePublished"
            >
              {post.date}
            </time>
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
            <MarkdownArticle content={post.content} />
          </div>
        </article>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </main>
    </BlogShell>
  );
}
