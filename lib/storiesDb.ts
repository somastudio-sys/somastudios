import type { RepurposedStory } from "@/lib/privateStoriesStorage";
import { ensureSchema } from "@/lib/db";
import { getSql } from "@/lib/sql";

type StoryRow = {
  id: string;
  created_at: Date | string;
  title: string;
  genre: string;
  dream_id: string | null;
  body: string;
};

function rowToStory(row: StoryRow): RepurposedStory {
  return {
    id: row.id,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : String(row.created_at),
    title: row.title,
    genre: row.genre,
    dreamId: row.dream_id ?? undefined,
    body: row.body,
  };
}

export async function listStories(userId: string): Promise<RepurposedStory[]> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT id, created_at, title, genre, dream_id, body
    FROM repurposed_stories
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;
  return (rows as StoryRow[]).map(rowToStory);
}

export async function getStoryById(
  userId: string,
  id: string
): Promise<RepurposedStory | null> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT id, created_at, title, genre, dream_id, body
    FROM repurposed_stories
    WHERE id = ${id} AND user_id = ${userId}
    LIMIT 1
  `;
  const list = rows as StoryRow[];
  return list[0] ? rowToStory(list[0]) : null;
}

export async function createStory(
  userId: string,
  entry: {
    title: string;
    genre: string;
    dreamId?: string;
    body: string;
    id?: string;
    createdAt?: string;
  }
): Promise<RepurposedStory> {
  await ensureSchema();
  const sql = getSql();
  const story: RepurposedStory = {
    id: entry.id ?? `story-${Date.now()}`,
    createdAt: entry.createdAt ?? new Date().toISOString(),
    title: entry.title.trim() || "Untitled story",
    genre: entry.genre,
    dreamId: entry.dreamId,
    body: entry.body.trim(),
  };

  await sql`
    INSERT INTO repurposed_stories (id, user_id, created_at, title, genre, dream_id, body)
    VALUES (
      ${story.id},
      ${userId},
      ${story.createdAt},
      ${story.title},
      ${story.genre},
      ${story.dreamId ?? null},
      ${story.body}
    )
  `;

  return story;
}

export async function deleteStory(userId: string, id: string): Promise<boolean> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    DELETE FROM repurposed_stories
    WHERE id = ${id} AND user_id = ${userId}
    RETURNING id
  `;
  return (rows as { id: string }[]).length > 0;
}

export async function deleteAllStories(userId: string): Promise<number> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    DELETE FROM repurposed_stories WHERE user_id = ${userId} RETURNING id
  `;
  return (rows as { id: string }[]).length;
}

export async function migrateStories(
  userId: string,
  stories: RepurposedStory[]
): Promise<number> {
  await ensureSchema();
  const sql = getSql();
  let imported = 0;
  for (const story of stories) {
    const rows = await sql`
      INSERT INTO repurposed_stories (id, user_id, created_at, title, genre, dream_id, body)
      VALUES (
        ${story.id},
        ${userId},
        ${story.createdAt},
        ${story.title},
        ${story.genre},
        ${story.dreamId ?? null},
        ${story.body}
      )
      ON CONFLICT (id) DO NOTHING
      RETURNING id
    `;
    if ((rows as { id: string }[]).length > 0) imported += 1;
  }
  return imported;
}
