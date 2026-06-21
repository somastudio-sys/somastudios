import { hashPassword } from "@/lib/password";
import { LEGACY_USER_ID } from "@/lib/usersDb";
import { getSql } from "@/lib/sql";

let schemaReady: Promise<void> | null = null;

export function hasDatabase(): boolean {
  return Boolean(process.env.POSTGRES_URL?.trim());
}

async function migrateLegacyOwnership(): Promise<void> {
  const sql = getSql();
  const orphanDreams = await sql`
    SELECT COUNT(*)::int AS n FROM dreams WHERE user_id IS NULL
  `;
  const orphanStories = await sql`
    SELECT COUNT(*)::int AS n FROM repurposed_stories WHERE user_id IS NULL
  `;
  const dreamCount = (orphanDreams as { n: number }[])[0]?.n ?? 0;
  const storyCount = (orphanStories as { n: number }[])[0]?.n ?? 0;
  if (dreamCount === 0 && storyCount === 0) return;

  const legacyEmail =
    process.env.DIARY_LEGACY_EMAIL?.trim() || "legacy@soma.local";
  const legacyPassword = process.env.DIARY_PASSWORD?.trim() || "soma";
  const passwordHash = hashPassword(legacyPassword);

  await sql`
    INSERT INTO users (id, email, password_hash, created_at)
    VALUES (${LEGACY_USER_ID}, ${legacyEmail}, ${passwordHash}, NOW())
    ON CONFLICT (id) DO NOTHING
  `;

  await sql`UPDATE dreams SET user_id = ${LEGACY_USER_ID} WHERE user_id IS NULL`;
  await sql`
    UPDATE repurposed_stories
    SET user_id = ${LEGACY_USER_ID}
    WHERE user_id IS NULL
  `;
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
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
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
      await sql`
        ALTER TABLE dreams ADD COLUMN IF NOT EXISTS user_id TEXT REFERENCES users(id)
      `;
      await sql`
        ALTER TABLE repurposed_stories ADD COLUMN IF NOT EXISTS user_id TEXT REFERENCES users(id)
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS dreams_user_id_idx ON dreams (user_id)
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS repurposed_stories_user_id_idx ON repurposed_stories (user_id)
      `;
      await sql`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_hash TEXT
      `;
      await sql`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expires_at TIMESTAMPTZ
      `;
      await migrateLegacyOwnership();
    })();
  }

  await schemaReady;
}
