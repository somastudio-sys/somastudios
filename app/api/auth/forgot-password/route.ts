import { NextResponse } from "next/server";
import { isEmailConfigured, sendPasswordResetEmail } from "@/lib/email";
import {
  generateResetToken,
  hashResetToken,
  RESET_TOKEN_TTL_MS,
} from "@/lib/resetToken";
import { getSiteUrl } from "@/lib/siteUrl";
import { findUserByEmail, normalizeEmail, setPasswordResetToken } from "@/lib/usersDb";

const GENERIC_OK =
  "If an account exists for that email, we sent a password reset link.";

export async function POST(req: Request) {
  let body: { email?: string };
  try {
    body = (await req.json()) as { email?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? normalizeEmail(body.email) : "";
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  try {
    const user = await findUserByEmail(email);
    let devResetUrl: string | undefined;

    if (user) {
      const token = generateResetToken();
      const resetUrl = `${getSiteUrl(req)}/reset-password?token=${encodeURIComponent(token)}`;
      const emailResult = await sendPasswordResetEmail(user.email, resetUrl);

      if (emailResult.sent || emailResult.devFallback) {
        const tokenHash = hashResetToken(token);
        const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS).toISOString();
        await setPasswordResetToken(user.id, tokenHash, expiresAt);

        if (emailResult.devFallback) {
          devResetUrl = resetUrl;
        }
      } else if (!isEmailConfigured()) {
        console.error(
          "[api/auth/forgot-password] RESEND_API_KEY not set in production — reset email not sent."
        );
      }
    }

    if (devResetUrl) {
      return NextResponse.json({
        ok: true,
        message:
          process.env.NODE_ENV === "development"
            ? "Email isn't configured for local dev. Use the reset link below (also printed in your terminal)."
            : "Your reset link is below. It expires in one hour.",
        devResetUrl,
      });
    }

    return NextResponse.json({ ok: true, message: GENERIC_OK });
  } catch (err) {
    console.error("[api/auth/forgot-password]", err);
    return NextResponse.json({ ok: true, message: GENERIC_OK });
  }
}
