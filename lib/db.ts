import { getSql } from "@/lib/sql";

let schemaReady: Promise<void> | null = null;

export function hasDatabase(): boolean {
  return Boolean(process.env.POSTGRES_URL?.trim());
}

export async function ensureSchema(): Promise<void> {
  if (!hasDatabase()) {
    throw new Error(
      "POSTGRES_URL is not configured. Add a Neon Postgres database to enable cloud storage."
    );
  }

  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = getSql();
      await sql`
        CREATE TABLE IF NOT EXISTS dreams (
          id TEXT PRIMARY KEY,
          date TEXT NOT NULL,
          title TEXT,
          content TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL,
          freud_analysis TEXT,
          analyzed_at TIMESTAMPTZ
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS repurposed_stories (
          id TEXT PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL,
          title TEXT NOT NULL,
          genre TEXT NOT NULL,
          dream_id TEXT,
          body TEXT NOT NULL
        )
      `;
    })();
  }

  await schemaReady;
}
