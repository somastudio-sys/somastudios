import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type DiarySession = {
  isLoggedIn?: boolean;
};

function sessionPassword(): string {
  const secret = process.env.DIARY_SESSION_SECRET?.trim();
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "DIARY_SESSION_SECRET must be set (32+ characters) in production."
    );
  }
  return "dev-only-soma-diary-session-secret-32chars";
}

function getSessionOptions(): SessionOptions {
  return {
    password: sessionPassword(),
    cookieName: "soma-diary-session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    },
  };
}

export async function getDiarySession() {
  return getIronSession<DiarySession>(await cookies(), getSessionOptions());
}

export async function requireDiarySession() {
  const session = await getDiarySession();
  if (!session.isLoggedIn) {
    return null;
  }
  return session;
}

export function diaryPassword(): string {
  return process.env.DIARY_PASSWORD?.trim() || "soma";
}
