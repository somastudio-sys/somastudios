"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AUTH_KEY = "soma-diary-auth";
const DEFAULT_PASSWORD = process.env.NEXT_PUBLIC_DIARY_PASSWORD || "soma";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password === DEFAULT_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, "1");
      router.push("/diary");
    } else {
      setError("Incorrect password. Try again.");
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
          />
          {error && <p className="login-error" role="alert">{error}</p>}
          <button type="submit" className="btn btn-primary login-submit">
            Log in to diary
          </button>
        </form>
        <div className="login-secondary-links">
          <Link href="/">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
