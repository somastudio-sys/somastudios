import { NextResponse } from "next/server";
import { hashResetToken } from "@/lib/resetToken";
import {
  findUserByResetTokenHash,
  updateUserPassword,
} from "@/lib/usersDb";

const MIN_PASSWORD_LENGTH = 8;

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token")?.trim() || "";
  if (!token) {
    return NextResponse.json({ valid: false });
  }

  try {
    const user = await findUserByResetTokenHash(hashResetToken(token));
    return NextResponse.json({ valid: Boolean(user) });
  } catch {
    return NextResponse.json({ valid: false });
  }
}

export async function POST(req: Request) {
  let body: { token?: string; password?: string };
  try {
    body = (await req.json()) as { token?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const token = typeof body.token === "string" ? body.token.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!token) {
    return NextResponse.json({ error: "Reset link is invalid or expired." }, { status: 400 });
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` },
      { status: 400 }
    );
  }

  try {
    const user = await findUserByResetTokenHash(hashResetToken(token));
    if (!user) {
      return NextResponse.json(
        { error: "Reset link is invalid or expired." },
        { status: 400 }
      );
    }

    await updateUserPassword(user.id, password);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not reset password.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
