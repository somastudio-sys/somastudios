/** Shared heading slug helpers for article TOC + markdown heading ids. */

export type BlogHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .trim();
}

/** Collect ## / ### headings from markdown in document order. */
export function extractMarkdownHeadings(content: string): BlogHeading[] {
  const headings: BlogHeading[] = [];
  const usedH2 = new Map<string, number>();
  const usedH3 = new Map<string, number>();

  for (const line of content.split("\n")) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match) continue;

    const level = match[1].length as 2 | 3;
    const text = stripInlineMarkdown(match[2]);
    if (!text) continue;

    const used = level === 2 ? usedH2 : usedH3;
    const base = slugifyHeading(text) || "section";
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count}`;
    headings.push({ id, text, level });
  }

  return headings;
}

/** @deprecated use extractMarkdownHeadings */
export function extractMarkdownH2s(content: string): BlogHeading[] {
  return extractMarkdownHeadings(content).filter((h) => h.level === 2);
}

export function createHeadingIdFactory() {
  const used = new Map<string, number>();
  return (text: string) => {
    const base = slugifyHeading(text) || "section";
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    return count === 0 ? base : `${base}-${count}`;
  };
}
