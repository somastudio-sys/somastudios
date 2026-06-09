import { NextResponse } from "next/server";
import { getDiarySession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getDiarySession();
    return NextResponse.json({ authenticated: Boolean(session.isLoggedIn) });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Session check failed.";
    return NextResponse.json({ error: message, authenticated: false }, { status: 500 });
  }
}
