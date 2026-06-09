"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/diaryApi";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(password);
      router.push("/diary");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed. Try again.";
      setError(message === "Incorrect password." ? "Incorrect password. Try again." : message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-main">
      <div className="login-card">
        <div className="login-header">
          <h1>Log in</h1>
          <p>Sign in to access your dream diary and archive.</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
            disabled={submitting}
          />
          {error && <p className="login-error" role="alert">{error}</p>}
          <button
            type="submit"
            className="btn btn-primary login-submit"
            disabled={submitting}
          >
            {submitting ? "Logging in…" : "Log in to diary"}
          </button>
        </form>
        <div className="login-secondary-links">
          <Link href="/">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
