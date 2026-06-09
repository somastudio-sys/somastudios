import type { DreamEntry } from "@/app/diary/types";
import { STORAGE_KEY as DREAMS_KEY } from "@/app/diary/types";
import type { RepurposedStory } from "@/lib/privateStoriesStorage";

const STORIES_KEY = "soma-repurposed-stories";
const LEGACY_STORIES_KEY = "soma-blog-stories";

function readJson<T>(raw: string | null): T[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function readLocalDreams(): DreamEntry[] {
  if (typeof window === "undefined") return [];
  return readJson<DreamEntry>(localStorage.getItem(DREAMS_KEY));
}

export function clearLocalDreams(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DREAMS_KEY);
}

export function readLocalStories(): RepurposedStory[] {
  if (typeof window === "undefined") return [];
  let stories = readJson<RepurposedStory>(localStorage.getItem(STORIES_KEY));
  if (stories.length === 0) {
    stories = readJson<RepurposedStory>(localStorage.getItem(LEGACY_STORIES_KEY));
  }
  return stories;
}

export function clearLocalStories(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORIES_KEY);
  localStorage.removeItem(LEGACY_STORIES_KEY);
}
