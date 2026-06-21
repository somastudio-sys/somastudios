import { NextResponse } from "next/server";
import { findUserById } from "@/lib/usersDb";
import { getDiarySession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getDiarySession();
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ authenticated: false });
    }

    const user = await findUserById(session.userId);
    if (!user) {
      session.destroy();
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      email: user.email,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Session check failed.";
    return NextResponse.json({ error: message, authenticated: false }, { status: 500 });
  }
}
