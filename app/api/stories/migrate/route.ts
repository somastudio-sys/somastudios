import { NextResponse } from "next/server";
import type { RepurposedStory } from "@/lib/privateStoriesStorage";
import { migrateStories } from "@/lib/storiesDb";
import { requireUserId } from "@/lib/session";

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: { stories?: RepurposedStory[] };
  try {
    body = (await req.json()) as { stories?: RepurposedStory[] };
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const stories = Array.isArray(body.stories) ? body.stories : [];
  if (stories.length === 0) {
    return NextResponse.json({ imported: 0 });
  }

  const valid = stories.filter(
    (s) =>
      s &&
      typeof s.id === "string" &&
      typeof s.createdAt === "string" &&
      typeof s.title === "string" &&
      typeof s.genre === "string" &&
      typeof s.body === "string"
  );

  try {
    const imported = await migrateStories(userId, valid);
    return NextResponse.json({ imported });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Migration failed." },
      { status: 500 }
    );
  }
}
