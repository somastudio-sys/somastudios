import type { DreamEntry } from "@/app/diary/types";
import { ensureSchema } from "@/lib/db";
import { getSql } from "@/lib/sql";

type DreamRow = {
  id: string;
  date: string;
  title: string | null;
  content: string;
  created_at: Date | string;
  freud_analysis: string | null;
  analyzed_at: Date | string | null;
};

function rowToDream(row: DreamRow): DreamEntry {
  return {
    id: row.id,
    date: row.date,
    title: row.title ?? undefined,
    content: row.content,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : String(row.created_at),
    freudAnalysis: row.freud_analysis ?? undefined,
    analyzedAt: row.analyzed_at
      ? row.analyzed_at instanceof Date
        ? row.analyzed_at.toISOString()
        : String(row.analyzed_at)
      : undefined,
  };
}

export async function listDreams(): Promise<DreamEntry[]> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT id, date, title, content, created_at, freud_analysis, analyzed_at
    FROM dreams
    ORDER BY created_at DESC
  `;
  return (rows as DreamRow[]).map(rowToDream);
}

export async function createDream(
  entry: Omit<DreamEntry, "id" | "createdAt"> & { id?: string; createdAt?: string }
): Promise<DreamEntry> {
  await ensureSchema();
  const sql = getSql();
  const id = entry.id ?? `dream-${Date.now()}`;
  const createdAt = entry.createdAt ?? new Date().toISOString();
  await sql`
    INSERT INTO dreams (id, date, title, content, created_at, freud_analysis, analyzed_at)
    VALUES (
      ${id},
      ${entry.date},
      ${entry.title ?? null},
      ${entry.content},
      ${createdAt},
      ${entry.freudAnalysis ?? null},
      ${entry.analyzedAt ?? null}
    )
  `;
  return {
    id,
    date: entry.date,
    title: entry.title,
    content: entry.content,
    createdAt,
    freudAnalysis: entry.freudAnalysis,
    analyzedAt: entry.analyzedAt,
  };
}

export async function updateDream(
  id: string,
  patch: Partial<
    Pick<DreamEntry, "date" | "title" | "content" | "freudAnalysis" | "analyzedAt">
  >
): Promise<DreamEntry | null> {
  await ensureSchema();
  const sql = getSql();
  const existing = await sql`
    SELECT id, date, title, content, created_at, freud_analysis, analyzed_at
    FROM dreams
    WHERE id = ${id}
    LIMIT 1
  `;
  const rows = existing as DreamRow[];
  if (rows.length === 0) return null;

  const current = rowToDream(rows[0]);
  const next: DreamEntry = {
    ...current,
    ...patch,
    title: patch.title === undefined ? current.title : patch.title || undefined,
  };

  await sql`
    UPDATE dreams
    SET
      date = ${next.date},
      title = ${next.title ?? null},
      content = ${next.content},
      freud_analysis = ${next.freudAnalysis ?? null},
      analyzed_at = ${next.analyzedAt ?? null}
    WHERE id = ${id}
  `;

  return next;
}

export async function deleteDream(id: string): Promise<boolean> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`DELETE FROM dreams WHERE id = ${id} RETURNING id`;
  return (rows as { id: string }[]).length > 0;
}

export async function migrateDreams(entries: DreamEntry[]): Promise<number> {
  await ensureSchema();
  const sql = getSql();
  let imported = 0;
  for (const entry of entries) {
    const rows = await sql`
      INSERT INTO dreams (id, date, title, content, created_at, freud_analysis, analyzed_at)
      VALUES (
        ${entry.id},
        ${entry.date},
        ${entry.title ?? null},
        ${entry.content},
        ${entry.createdAt},
        ${entry.freudAnalysis ?? null},
        ${entry.analyzedAt ?? null}
      )
      ON CONFLICT (id) DO NOTHING
      RETURNING id
    `;
    if ((rows as { id: string }[]).length > 0) imported += 1;
  }
  return imported;
}
