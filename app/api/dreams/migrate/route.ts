import { NextResponse } from "next/server";
import type { DreamEntry } from "@/app/diary/types";
import { migrateDreams } from "@/lib/dreamsDb";
import { requireUserId } from "@/lib/session";

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: { dreams?: DreamEntry[] };
  try {
    body = (await req.json()) as { dreams?: DreamEntry[] };
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const dreams = Array.isArray(body.dreams) ? body.dreams : [];
  if (dreams.length === 0) {
    return NextResponse.json({ imported: 0 });
  }

  const valid = dreams.filter(
    (d) =>
      d &&
      typeof d.id === "string" &&
      typeof d.date === "string" &&
      typeof d.content === "string" &&
      typeof d.createdAt === "string"
  );

  try {
    const imported = await migrateDreams(userId, valid);
    return NextResponse.json({ imported });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Migration failed." },
      { status: 500 }
    );
  }
}
