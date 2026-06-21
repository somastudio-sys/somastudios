import { NextResponse } from "next/server";
import { deleteAllDreams } from "@/lib/dreamsDb";
import { requireUserId } from "@/lib/session";

export async function DELETE() {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const deleted = await deleteAllDreams(userId);
    return NextResponse.json({ deleted });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete dreams." },
      { status: 500 }
    );
  }
}
