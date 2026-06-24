import { ensureSchema } from "@/lib/db";
import { getSql } from "@/lib/sql";
import {
  findUserById,
  LEGACY_USER_ID,
  normalizeEmail,
} from "@/lib/usersDb";

export type LegacyMergeResult = {
  email: string;
  dreamsMoved: number;
  dreamsRenamed: number;
  storiesMoved: number;
  storiesRenamed: number;
};

function newDreamId(): string {
  return `dream-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function newStoryId(): string {
  return `story-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function mergeLegacyArchiveToUser(
  userId: string
): Promise<LegacyMergeResult> {
  if (userId === LEGACY_USER_ID) {
    throw new Error("Cannot merge legacy archive into the legacy account itself.");
  }

  const user = await findUserById(userId);
  if (!user) {
    throw new Error("User not found.");
  }

  await ensureSchema();
  const sql = getSql();
  const targetId = user.id;

  const conflictingDreams = await sql`
    SELECT legacy.id
    FROM dreams legacy
    INNER JOIN dreams existing ON existing.id = legacy.id
    WHERE legacy.user_id = ${LEGACY_USER_ID}
      AND existing.user_id = ${targetId}
  `;

  let dreamsRenamed = 0;
  for (const row of conflictingDreams as { id: string }[]) {
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
    SET user_id = ${targetId}
    WHERE user_id = ${LEGACY_USER_ID}
    RETURNING id
  `;

  const conflictingStories = await sql`
    SELECT legacy.id
    FROM repurposed_stories legacy
    INNER JOIN repurposed_stories existing ON existing.id = legacy.id
    WHERE legacy.user_id = ${LEGACY_USER_ID}
      AND existing.user_id = ${targetId}
  `;

  let storiesRenamed = 0;
  for (const row of conflictingStories as { id: string }[]) {
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
    SET user_id = ${targetId}
    WHERE user_id = ${LEGACY_USER_ID}
    RETURNING id
  `;

  return {
    email: user.email,
    dreamsMoved: (movedDreams as { id: string }[]).length,
    dreamsRenamed,
    storiesMoved: (movedStories as { id: string }[]).length,
    storiesRenamed,
  };
}

export async function mergeLegacyArchiveToEmail(
  email: string
): Promise<LegacyMergeResult> {
  await ensureSchema();
  const sql = getSql();
  const normalized = normalizeEmail(email);

  const users = await sql`
    SELECT id FROM users WHERE email = ${normalized} LIMIT 1
  `;
  const target = (users as { id: string }[])[0];
  if (!target) {
    throw new Error(`No user found for ${normalized}.`);
  }

  return mergeLegacyArchiveToUser(target.id);
}
