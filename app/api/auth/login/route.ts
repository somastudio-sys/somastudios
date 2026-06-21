import { NextResponse } from "next/server";
import { getDiarySession } from "@/lib/session";
import { normalizeEmail, verifyUserCredentials } from "@/lib/usersDb";

export async function POST(req: Request) {
  let body: { email?: string; password?: string };
  try {
    body = (await req.json()) as { email?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? normalizeEmail(body.email) : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  try {
    const user = await verifyUserCredentials(email, password);
    if (!user) {
      return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    }

    const session = await getDiarySession();
    session.isLoggedIn = true;
    session.userId = user.id;
    await session.save();
    return NextResponse.json({ ok: true, email: user.email });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not start session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
