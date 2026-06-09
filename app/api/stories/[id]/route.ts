import { NextResponse } from "next/server";
import { deleteStory, getStoryById } from "@/lib/storiesDb";
import { requireDiarySession } from "@/lib/session";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: RouteContext) {
  const session = await requireDiarySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id?.trim()) {
    return NextResponse.json({ error: "Story id is required." }, { status: 400 });
  }

  try {
    const story = await getStoryById(id);
    if (!story) {
      return NextResponse.json({ error: "Story not found." }, { status: 404 });
    }
    return NextResponse.json({ story });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load story." },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  const session = await requireDiarySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id?.trim()) {
    return NextResponse.json({ error: "Story id is required." }, { status: 400 });
  }

  try {
    const removed = await deleteStory(id);
    if (!removed) {
      return NextResponse.json({ error: "Story not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete story." },
      { status: 500 }
    );
  }
}
