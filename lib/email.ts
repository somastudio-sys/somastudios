type SendResult = {
  sent: boolean;
  /** True when no email provider is configured (local dev / emergency fallback). */
  devFallback?: boolean;
};

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

function allowPasswordResetDevFallback(): boolean {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.PASSWORD_RESET_DEV_FALLBACK === "true"
  );
}

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from =
    process.env.EMAIL_FROM?.trim() || "Soma <onboarding@resend.dev>";

  if (!apiKey) {
    if (allowPasswordResetDevFallback()) {
      console.log(
        `[password-reset] RESEND_API_KEY not set — reset link for ${to}:\n${resetUrl}`
      );
      return { sent: false, devFallback: true };
    }
    console.error(
      "[password-reset] RESEND_API_KEY is not configured; email not sent."
    );
    return { sent: false };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "Reset your Soma diary password",
      html: `
        <p>You asked to reset your Soma dream diary password.</p>
        <p><a href="${resetUrl}">Reset your password</a></p>
        <p>This link expires in one hour. If you did not request this, you can ignore this email.</p>
        <p style="color:#666;font-size:12px;">If the button does not work, copy this URL into your browser:<br>${resetUrl}</p>
      `,
      text: `Reset your Soma password (expires in one hour):\n${resetUrl}\n\nIf you did not request this, ignore this email.`,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[password-reset] Resend error:", res.status, body);
    if (allowPasswordResetDevFallback()) {
      return { sent: false, devFallback: true };
    }
    return { sent: false };
  }

  return { sent: true };
}
