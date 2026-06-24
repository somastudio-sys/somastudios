import type { DreamEntry } from "@/app/diary/types";
import type { RepurposedStory } from "@/lib/privateStoriesStorage";

async function readJson<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T & { error?: string };
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export type SessionInfo = {
  authenticated: boolean;
  email?: string;
};

export async function fetchSession(): Promise<SessionInfo> {
  const res = await fetch("/api/auth/session", { cache: "no-store" });
  return readJson(res);
}

export async function signup(email: string, password: string): Promise<{ email: string }> {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await readJson<{ email: string }>(res);
  return { email: data.email };
}

export async function login(email: string, password: string): Promise<void> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  await readJson(res);
}

export async function requestPasswordReset(
  email: string
): Promise<{ message: string; devResetUrl?: string }> {
  const res = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await readJson<{ message: string; devResetUrl?: string }>(res);
  return { message: data.message, devResetUrl: data.devResetUrl };
}

export async function validateResetToken(token: string): Promise<boolean> {
  const res = await fetch(
    `/api/auth/reset-password?token=${encodeURIComponent(token)}`,
    { cache: "no-store" }
  );
  const data = await readJson<{ valid: boolean }>(res);
  return data.valid;
}

export async function resetPassword(
  token: string,
  password: string
): Promise<void> {
  const res = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
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

export async function deleteAllDreamsApi(): Promise<number> {
  const res = await fetch("/api/account/dreams", { method: "DELETE" });
  const data = await readJson<{ deleted: number }>(res);
  return data.deleted;
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

export async function deleteAllStoriesApi(): Promise<number> {
  const res = await fetch("/api/account/stories", { method: "DELETE" });
  const data = await readJson<{ deleted: number }>(res);
  return data.deleted;
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

export type LegacyMergeResult = {
  email: string;
  dreamsMoved: number;
  dreamsRenamed: number;
  storiesMoved: number;
  storiesRenamed: number;
};

export async function mergeLegacyArchiveApi(): Promise<LegacyMergeResult> {
  const res = await fetch("/api/account/merge-legacy", { method: "POST" });
  return readJson<LegacyMergeResult & { ok: true }>(res);
}
