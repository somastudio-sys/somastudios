/** Repurposed story journeys — private, browser-only, diary login area. */

export type RepurposedStory = {
  id: string;
  createdAt: string;
  title: string;
  genre: string;
  dreamId?: string;
  body: string;
};

const STORAGE_KEY = "soma-repurposed-stories";
/** Migrated from old key when we split marketing blog vs private stories */
const LEGACY_BLOG_KEY = "soma-blog-stories";

function migrateLegacy(): void {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const legacy = localStorage.getItem(LEGACY_BLOG_KEY);
    if (!legacy) return;
    localStorage.setItem(STORAGE_KEY, legacy);
    localStorage.removeItem(LEGACY_BLOG_KEY);
  } catch {
    /* ignore */
  }
}

export function loadPrivateStories(): RepurposedStory[] {
  if (typeof window === "undefined") return [];
  migrateLegacy();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RepurposedStory[]) : [];
  } catch {
    return [];
  }
}

export function savePrivateStories(stories: RepurposedStory[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
}

export function addPrivateStory(entry: {
  title: string;
  genre: string;
  dreamId?: string;
  body: string;
}): RepurposedStory {
  const story: RepurposedStory = {
    id: `story-${Date.now()}`,
    createdAt: new Date().toISOString(),
    title: entry.title.trim() || "Untitled story",
    genre: entry.genre,
    dreamId: entry.dreamId,
    body: entry.body.trim(),
  };
  const next = [story, ...loadPrivateStories()];
  savePrivateStories(next);
  return story;
}

export function deletePrivateStory(id: string) {
  savePrivateStories(loadPrivateStories().filter((s) => s.id !== id));
}
