import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export type BlogPostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  publishedAt: string;
};

export type BlogPost = BlogPostMeta & {
  content: string;
};

function isPostFile(name: string): boolean {
  return name.endsWith(".md") && !name.startsWith("_");
}

function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, "");
}

function normalizeDate(raw: string): { display: string; iso: string } {
  const trimmed = raw.trim();
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return {
      display: parsed.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      iso: parsed.toISOString(),
    };
  }
  return { display: trimmed, iso: trimmed };
}

function parseFile(filename: string): BlogPost | null {
  const slug = slugFromFilename(filename);
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  const title = typeof data.title === "string" ? data.title.trim() : "";
  const dateRaw = typeof data.date === "string" ? data.date.trim() : "";
  const excerpt =
    typeof data.excerpt === "string" ? data.excerpt.trim() : "";

  if (!title || !dateRaw) return null;

  const { display, iso } = normalizeDate(dateRaw);

  return {
    slug,
    title,
    date: display,
    excerpt,
    publishedAt: iso,
    content: content.trim(),
  };
}

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter(isPostFile)
    .map((file) => parseFile(file))
    .filter((post): post is BlogPost => post !== null)
    .map(({ slug, title, date, excerpt, publishedAt }) => ({
      slug,
      title,
      date,
      excerpt,
      publishedAt,
    }))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getPostBySlug(slug: string): BlogPost | null {
  if (!slug || slug.includes("..") || slug.includes("/")) return null;
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return parseFile(`${slug}.md`);
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}
