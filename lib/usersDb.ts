import { ensureSchema } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { getSql } from "@/lib/sql";

export const LEGACY_USER_ID = "user-legacy";

export type User = {
  id: string;
  email: string;
  createdAt: string;
};

type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  created_at: Date | string;
};

function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : String(row.created_at),
  };
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function findUserByEmail(email: string): Promise<(User & { passwordHash: string }) | null> {
  await ensureSchema();
  const sql = getSql();
  const normalized = normalizeEmail(email);
  const rows = await sql`
    SELECT id, email, password_hash, created_at
    FROM users
    WHERE email = ${normalized}
    LIMIT 1
  `;
  const row = (rows as UserRow[])[0];
  if (!row) return null;
  return { ...rowToUser(row), passwordHash: row.password_hash };
}

export async function findUserById(id: string): Promise<User | null> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT id, email, password_hash, created_at
    FROM users
    WHERE id = ${id}
    LIMIT 1
  `;
  const row = (rows as UserRow[])[0];
  return row ? rowToUser(row) : null;
}

export async function createUser(email: string, password: string): Promise<User> {
  await ensureSchema();
  const sql = getSql();
  const normalized = normalizeEmail(email);
  const id = `user-${Date.now()}-${randomSuffix()}`;
  const passwordHash = hashPassword(password);
  const createdAt = new Date().toISOString();

  await sql`
    INSERT INTO users (id, email, password_hash, created_at)
    VALUES (${id}, ${normalized}, ${passwordHash}, ${createdAt})
  `;

  return { id, email: normalized, createdAt };
}

export async function verifyUserCredentials(
  email: string,
  password: string
): Promise<User | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;
  if (!verifyPassword(password, user.passwordHash)) return null;
  const { passwordHash: _, ...safe } = user;
  return safe;
}

export async function setPasswordResetToken(
  userId: string,
  tokenHash: string,
  expiresAt: string
): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  await sql`
    UPDATE users
    SET reset_token_hash = ${tokenHash}, reset_token_expires_at = ${expiresAt}
    WHERE id = ${userId}
  `;
}

export async function findUserByResetTokenHash(
  tokenHash: string
): Promise<User | null> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT id, email, password_hash, created_at
    FROM users
    WHERE reset_token_hash = ${tokenHash}
      AND reset_token_expires_at IS NOT NULL
      AND reset_token_expires_at > NOW()
    LIMIT 1
  `;
  const row = (rows as UserRow[])[0];
  return row ? rowToUser(row) : null;
}

export async function updateUserPassword(
  userId: string,
  password: string
): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  const passwordHash = hashPassword(password);
  await sql`
    UPDATE users
    SET
      password_hash = ${passwordHash},
      reset_token_hash = NULL,
      reset_token_expires_at = NULL
    WHERE id = ${userId}
  `;
}

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 10);
}
