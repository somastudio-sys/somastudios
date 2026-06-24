import { NextResponse } from "next/server";
import { mergeLegacyArchiveToUser } from "@/lib/legacyMerge";
import { requireUserId } from "@/lib/session";

export async function POST() {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const result = await mergeLegacyArchiveToUser(userId);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Could not merge legacy archive.",
      },
      { status: 500 }
    );
  }
}
