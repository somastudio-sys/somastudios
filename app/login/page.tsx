import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Log in</h1>
        <p className="login-tagline">
          Sign in to access your dream diary and archive.
        </p>
        <Link href="/diary" className="btn btn-primary btn-large">
          Open diary
        </Link>
        <Link href="/" className="login-back">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
