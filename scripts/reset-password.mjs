#!/usr/bin/env node
/**
 * Emergency password reset when email isn't configured.
 *
 * Usage:
 *   POSTGRES_URL="postgres://..." node scripts/reset-password.mjs you@example.com "new-password"
 */

import { randomBytes, scryptSync } from "node:crypto";
import { neon } from "@neondatabase/serverless";

const KEY_LEN = 64;

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LEN).toString("hex");
  return `${salt}:${hash}`;
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

const email = process.argv[2];
const password = process.argv[3];
const postgresUrl = process.env.POSTGRES_URL?.trim();

if (!email || !password) {
  console.error(
    "Usage: POSTGRES_URL=... node scripts/reset-password.mjs <email> <new-password>"
  );
  process.exit(1);
}

if (!postgresUrl) {
  console.error("POSTGRES_URL is required.");
  process.exit(1);
}

if (password.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const sql = neon(postgresUrl);
const normalized = normalizeEmail(email);
const passwordHash = hashPassword(password);

const rows = await sql`
  UPDATE users
  SET
    password_hash = ${passwordHash},
    reset_token_hash = NULL,
    reset_token_expires_at = NULL
  WHERE email = ${normalized}
  RETURNING email
`;

if (!rows.length) {
  console.error(`No user found for ${normalized}.`);
  process.exit(1);
}

console.log(`Password updated for ${rows[0].email}.`);
