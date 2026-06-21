import { NextResponse } from "next/server";
import { deleteAllStories } from "@/lib/storiesDb";
import { requireUserId } from "@/lib/session";

export async function DELETE() {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const deleted = await deleteAllStories(userId);
    return NextResponse.json({ deleted });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete stories." },
      { status: 500 }
    );
  }
}
