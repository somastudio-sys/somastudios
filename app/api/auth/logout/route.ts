import { NextResponse } from "next/server";
import { getDiarySession } from "@/lib/session";

export async function POST() {
  const session = await getDiarySession();
  session.destroy();
  return NextResponse.json({ ok: true });
}
