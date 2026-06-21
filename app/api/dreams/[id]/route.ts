import { NextResponse } from "next/server";
import { deleteDream, updateDream } from "@/lib/dreamsDb";
import { requireUserId } from "@/lib/session";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, context: RouteContext) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id?.trim()) {
    return NextResponse.json({ error: "Dream id is required." }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const patch: Parameters<typeof updateDream>[2] = {};
  if (typeof body.date === "string") patch.date = body.date;
  if (typeof body.title === "string") patch.title = body.title.trim() || undefined;
  if (typeof body.content === "string") patch.content = body.content.trim();
  if (typeof body.freudAnalysis === "string") patch.freudAnalysis = body.freudAnalysis;
  if (typeof body.analyzedAt === "string") patch.analyzedAt = body.analyzedAt;

  try {
    const dream = await updateDream(userId, id, patch);
    if (!dream) {
      return NextResponse.json({ error: "Dream not found." }, { status: 404 });
    }
    return NextResponse.json({ dream });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update dream." },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id?.trim()) {
    return NextResponse.json({ error: "Dream id is required." }, { status: 400 });
  }

  try {
    const removed = await deleteDream(userId, id);
    if (!removed) {
      return NextResponse.json({ error: "Dream not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete dream." },
      { status: 500 }
    );
  }
}
