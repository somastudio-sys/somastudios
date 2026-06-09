import { NextResponse } from "next/server";
import { diaryPassword, getDiarySession } from "@/lib/session";

export async function POST(req: Request) {
  let body: { password?: string };
  try {
    body = (await req.json()) as { password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const password = typeof body.password === "string" ? body.password : "";
  if (password !== diaryPassword()) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const session = await getDiarySession();
  session.isLoggedIn = true;
  await session.save();

  return NextResponse.json({ ok: true });
}
