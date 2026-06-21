"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/diaryApi";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (searchParams.get("reset") === "1") {
      setSuccess("Password updated. You can log in with your new password.");
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/diary");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed. Try again.";
      setError(
        message === "Incorrect email or password."
          ? "Incorrect email or password. Try again."
          : message
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-main">
      <div className="login-card">
        <div className="login-header">
          <h1>Log in</h1>
          <p>Sign in to access your dream diary and cloud archive.</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">
            Email
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={submitting}
              required
            />
          </label>
          <label htmlFor="password">
            Password
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              disabled={submitting}
              required
            />
          </label>
          <p className="login-forgot">
            <Link href="/forgot-password">Forgot your password?</Link>
          </p>
          {success ? (
            <p className="login-success" role="status">
              {success}
            </p>
          ) : null}
          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="btn btn-primary login-submit"
            disabled={submitting}
          >
            {submitting ? "Logging in…" : "Log in to diary"}
          </button>
        </form>
        <div className="login-secondary-links">
          <span>No account?</span>
          <Link href="/signup">Sign up</Link>
          <span>·</span>
          <Link href="/">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
