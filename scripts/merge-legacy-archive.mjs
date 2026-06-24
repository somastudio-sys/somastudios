#!/usr/bin/env node
/**
 * Move all dreams and stories from the legacy account into a user account.
 *
 * Usage:
 *   POSTGRES_URL="postgres://..." node scripts/merge-legacy-archive.mjs you@example.com
 */

import { neon } from "@neondatabase/serverless";

const LEGACY_USER_ID = "user-legacy";

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function newDreamId() {
  return `dream-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function newStoryId() {
  return `story-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

const email = process.argv[2];
const postgresUrl = process.env.POSTGRES_URL?.trim();

if (!email) {
  console.error(
    "Usage: POSTGRES_URL=... node scripts/merge-legacy-archive.mjs <email>"
  );
  process.exit(1);
}

if (!postgresUrl) {
  console.error("POSTGRES_URL is required.");
  process.exit(1);
}

const sql = neon(postgresUrl);
const normalized = normalizeEmail(email);

const users = await sql`
  SELECT id, email FROM users WHERE email = ${normalized} LIMIT 1
`;
const target = users[0];
if (!target) {
  console.error(`No user found for ${normalized}.`);
  process.exit(1);
}
if (target.id === LEGACY_USER_ID) {
  console.error("Cannot merge legacy archive into the legacy account itself.");
  process.exit(1);
}

const legacyDreamCount = await sql`
  SELECT COUNT(*)::int AS n FROM dreams WHERE user_id = ${LEGACY_USER_ID}
`;
const legacyStoryCount = await sql`
  SELECT COUNT(*)::int AS n FROM repurposed_stories WHERE user_id = ${LEGACY_USER_ID}
`;

console.log(
  `Legacy archive: ${legacyDreamCount[0]?.n ?? 0} dreams, ${legacyStoryCount[0]?.n ?? 0} stories`
);

const conflictingDreams = await sql`
  SELECT legacy.id
  FROM dreams legacy
  INNER JOIN dreams existing ON existing.id = legacy.id
  WHERE legacy.user_id = ${LEGACY_USER_ID}
    AND existing.user_id = ${target.id}
`;

let dreamsRenamed = 0;
for (const row of conflictingDreams) {
  const nextId = newDreamId();
  await sql`
    UPDATE repurposed_stories
    SET dream_id = ${nextId}
    WHERE dream_id = ${row.id} AND user_id = ${LEGACY_USER_ID}
  `;
  await sql`
    UPDATE dreams
    SET id = ${nextId}
    WHERE id = ${row.id} AND user_id = ${LEGACY_USER_ID}
  `;
  dreamsRenamed += 1;
}

const movedDreams = await sql`
  UPDATE dreams
  SET user_id = ${target.id}
  WHERE user_id = ${LEGACY_USER_ID}
  RETURNING id
`;

const conflictingStories = await sql`
  SELECT legacy.id
  FROM repurposed_stories legacy
  INNER JOIN repurposed_stories existing ON existing.id = legacy.id
  WHERE legacy.user_id = ${LEGACY_USER_ID}
    AND existing.user_id = ${target.id}
`;

let storiesRenamed = 0;
for (const row of conflictingStories) {
  const nextId = newStoryId();
  await sql`
    UPDATE repurposed_stories
    SET id = ${nextId}
    WHERE id = ${row.id} AND user_id = ${LEGACY_USER_ID}
  `;
  storiesRenamed += 1;
}

const movedStories = await sql`
  UPDATE repurposed_stories
  SET user_id = ${target.id}
  WHERE user_id = ${LEGACY_USER_ID}
  RETURNING id
`;

console.log(`Merged into ${target.email}:`);
console.log(`  Dreams moved: ${movedDreams.length} (${dreamsRenamed} renamed for id conflicts)`);
console.log(
  `  Stories moved: ${movedStories.length} (${storiesRenamed} renamed for id conflicts)`
);
