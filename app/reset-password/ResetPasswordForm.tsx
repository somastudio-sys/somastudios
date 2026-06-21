"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword, validateResetToken } from "@/lib/diaryApi";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checking, setChecking] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!token) {
      setChecking(false);
      setTokenValid(false);
      return;
    }
    validateResetToken(token)
      .then((valid) => {
        if (!cancelled) {
          setTokenValid(valid);
          setChecking(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTokenValid(false);
          setChecking(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword(token, password);
      router.push("/login?reset=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset password.");
    } finally {
      setSubmitting(false);
    }
  }

  if (checking) {
    return (
      <div className="login-main">
        <div className="login-card">
          <p className="login-note">Checking your reset link…</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="login-main">
        <div className="login-card">
          <div className="login-header">
            <h1>Link expired</h1>
            <p>
              This password reset link is invalid or has expired. Request a new
              one below.
            </p>
          </div>
          <div className="login-secondary-links">
            <Link href="/forgot-password">Request new reset link</Link>
            <span>·</span>
            <Link href="/login">← Back to log in</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-main">
      <div className="login-card">
        <div className="login-header">
          <h1>Choose a new password</h1>
          <p>Enter a new password for your diary account.</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="reset-password">
            New password
            <input
              id="reset-password"
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
          <label htmlFor="reset-confirm">
            Confirm password
            <input
              id="reset-confirm"
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
          {error ? (
            <p className="login-error" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="btn btn-primary login-submit"
            disabled={submitting}
          >
            {submitting ? "Saving…" : "Update password"}
          </button>
        </form>
        <div className="login-secondary-links">
          <Link href="/login">← Back to log in</Link>
        </div>
      </div>
    </div>
  );
}
