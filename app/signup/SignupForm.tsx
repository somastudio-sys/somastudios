"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signup } from "@/lib/diaryApi";

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await signup(email, password);
      router.push("/diary");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-main">
      <div className="login-card">
        <div className="login-header">
          <h1>Create account</h1>
          <p>
            Your dreams and stories are saved to your private cloud archive—only
            visible when you log in.
          </p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="signup-email">
            Email
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={submitting}
              required
            />
          </label>
          <label htmlFor="signup-password">
            Password
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              minLength={8}
              disabled={submitting}
              required
            />
          </label>
          <label htmlFor="signup-confirm">
            Confirm password
            <input
              id="signup-confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              autoComplete="new-password"
              minLength={8}
              disabled={submitting}
              required
            />
          </label>
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
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>
        <div className="login-secondary-links">
          <span>Already have an account?</span>
          <Link href="/login">Log in</Link>
          <span>·</span>
          <Link href="/">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
