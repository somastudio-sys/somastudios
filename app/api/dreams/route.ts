import { NextResponse } from "next/server";
import type { DreamEntry } from "@/app/diary/types";
import { createDream, listDreams } from "@/lib/dreamsDb";
import { requireUserId } from "@/lib/session";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const dreams = await listDreams(userId);
    return NextResponse.json({ dreams });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load dreams." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: Partial<DreamEntry>;
  try {
    body = (await req.json()) as Partial<DreamEntry>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (!content) {
    return NextResponse.json({ error: "Dream content is required." }, { status: 400 });
  }

  const date =
    typeof body.date === "string" && body.date.trim()
      ? body.date.trim()
      : new Date().toISOString().slice(0, 10);

  try {
    const dream = await createDream(userId, {
      id: typeof body.id === "string" ? body.id : undefined,
      createdAt: typeof body.createdAt === "string" ? body.createdAt : undefined,
      date,
      title: typeof body.title === "string" ? body.title.trim() || undefined : undefined,
      content,
      freudAnalysis:
        typeof body.freudAnalysis === "string" ? body.freudAnalysis : undefined,
      analyzedAt: typeof body.analyzedAt === "string" ? body.analyzedAt : undefined,
    });
    return NextResponse.json({ dream }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save dream." },
      { status: 500 }
    );
  }
}
