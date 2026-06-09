import type { DreamEntry } from "@/app/diary/types";
import type { RepurposedStory } from "@/lib/privateStoriesStorage";

async function readJson<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T & { error?: string };
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export async function fetchSession(): Promise<{ authenticated: boolean }> {
  const res = await fetch("/api/auth/session", { cache: "no-store" });
  return readJson(res);
}

export async function login(password: string): Promise<void> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  await readJson(res);
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

export async function fetchDreams(): Promise<DreamEntry[]> {
  const res = await fetch("/api/dreams", { cache: "no-store" });
  const data = await readJson<{ dreams: DreamEntry[] }>(res);
  return data.dreams;
}

export async function createDreamApi(
  entry: Omit<DreamEntry, "id" | "createdAt"> & {
    id?: string;
    createdAt?: string;
  }
): Promise<DreamEntry> {
  const res = await fetch("/api/dreams", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  const data = await readJson<{ dream: DreamEntry }>(res);
  return data.dream;
}

export async function updateDreamApi(
  id: string,
  patch: Partial<
    Pick<DreamEntry, "date" | "title" | "content" | "freudAnalysis" | "analyzedAt">
  >
): Promise<DreamEntry> {
  const res = await fetch(`/api/dreams/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  const data = await readJson<{ dream: DreamEntry }>(res);
  return data.dream;
}

export async function deleteDreamApi(id: string): Promise<void> {
  const res = await fetch(`/api/dreams/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  await readJson(res);
}

export async function migrateDreamsApi(entries: DreamEntry[]): Promise<number> {
  const res = await fetch("/api/dreams/migrate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dreams: entries }),
  });
  const data = await readJson<{ imported: number }>(res);
  return data.imported;
}

export async function fetchStories(): Promise<RepurposedStory[]> {
  const res = await fetch("/api/stories", { cache: "no-store" });
  const data = await readJson<{ stories: RepurposedStory[] }>(res);
  return data.stories;
}

export async function fetchStoryById(id: string): Promise<RepurposedStory | null> {
  const res = await fetch(`/api/stories/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  const data = await readJson<{ story: RepurposedStory }>(res);
  return data.story;
}

export async function createStoryApi(entry: {
  title: string;
  genre: string;
  dreamId?: string;
  body: string;
}): Promise<RepurposedStory> {
  const res = await fetch("/api/stories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  const data = await readJson<{ story: RepurposedStory }>(res);
  return data.story;
}

export async function deleteStoryApi(id: string): Promise<void> {
  const res = await fetch(`/api/stories/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  await readJson(res);
}

export async function migrateStoriesApi(
  stories: RepurposedStory[]
): Promise<number> {
  const res = await fetch("/api/stories/migrate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stories }),
  });
  const data = await readJson<{ imported: number }>(res);
  return data.imported;
}
