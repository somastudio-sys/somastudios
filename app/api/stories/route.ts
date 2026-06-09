import { NextResponse } from "next/server";
import { createStory, listStories } from "@/lib/storiesDb";
import { requireDiarySession } from "@/lib/session";

export async function GET() {
  const session = await requireDiarySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const stories = await listStories();
    return NextResponse.json({ stories });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load stories." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await requireDiarySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: {
    title?: string;
    genre?: string;
    dreamId?: string;
    body?: string;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const storyBody = typeof body.body === "string" ? body.body.trim() : "";
  const genre = typeof body.genre === "string" ? body.genre.trim() : "";
  if (!storyBody || !genre) {
    return NextResponse.json(
      { error: "Story body and genre are required." },
      { status: 400 }
    );
  }

  try {
    const story = await createStory({
      title: typeof body.title === "string" ? body.title : "Untitled story",
      genre,
      dreamId: typeof body.dreamId === "string" ? body.dreamId : undefined,
      body: storyBody,
    });
    return NextResponse.json({ story }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save story." },
      { status: 500 }
    );
  }
}
