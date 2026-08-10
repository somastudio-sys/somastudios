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
  category: string;
  image: string | null;
  imageAlt: string;
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
  const category =
    typeof data.category === "string" && data.category.trim()
      ? data.category.trim()
      : "Article";
  const image =
    typeof data.image === "string" && data.image.trim()
      ? data.image.trim()
      : null;
  const imageAlt =
    typeof data.imageAlt === "string" && data.imageAlt.trim()
      ? data.imageAlt.trim()
      : title;

  if (!title || !dateRaw) return null;

  const { display, iso } = normalizeDate(dateRaw);

  return {
    slug,
    title,
    date: display,
    excerpt,
    publishedAt: iso,
    category,
    image,
    imageAlt,
    content: content.trim(),
  };
}

function toMeta({
  slug,
  title,
  date,
  excerpt,
  publishedAt,
  category,
  image,
  imageAlt,
}: BlogPost): BlogPostMeta {
  return {
    slug,
    title,
    date,
    excerpt,
    publishedAt,
    category,
    image,
    imageAlt,
  };
}

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter(isPostFile)
    .map((file) => parseFile(file))
    .filter((post): post is BlogPost => post !== null)
    .map(toMeta)
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
