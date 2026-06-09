import { NextResponse } from "next/server";
import { getDiarySession } from "@/lib/session";

export async function GET() {
  const session = await getDiarySession();
  return NextResponse.json({ authenticated: Boolean(session.isLoggedIn) });
}
