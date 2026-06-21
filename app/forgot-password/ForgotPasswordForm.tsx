"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/diaryApi";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setDevResetUrl(null);
    setSubmitting(true);
    try {
      const result = await requestPasswordReset(email);
      setMessage(result.message);
      setDevResetUrl(result.devResetUrl ?? null);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-main">
      <div className="login-card">
        <div className="login-header">
          <h1>Forgot password</h1>
          <p>
            Enter your email and we&apos;ll send you a link to choose a new
            password.
          </p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="forgot-email">
            Email
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={submitting}
              required
            />
          </label>
          {error ? (
            <p className="login-error" role="alert">
              {error}
            </p>
          ) : null}
          {message ? (
            <p className="login-success" role="status">
              {message}
            </p>
          ) : null}
          {devResetUrl ? (
            <div className="login-dev-reset">
              <a href={devResetUrl} className="btn btn-primary login-submit">
                Reset password now
              </a>
              <p className="login-note">
                Or copy this link:{" "}
                <code className="login-dev-reset-url">{devResetUrl}</code>
              </p>
            </div>
          ) : null}
          <button
            type="submit"
            className="btn btn-primary login-submit"
            disabled={submitting}
          >
            {submitting ? "Sending…" : "Send reset link"}
          </button>
        </form>
        <div className="login-secondary-links">
          <Link href="/login">← Back to log in</Link>
        </div>
      </div>
    </div>
  );
}
