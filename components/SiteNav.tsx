import Link from "next/link";

export default function SiteNav() {
  return (
    <div className="nav-bar">
      <div className="nav-bar-start">
        <Link href="/" className="nav-brand">
          <img
            src="/assets/soma-studio-logo.png"
            alt="Soma Studios"
            className="nav-brand-logo"
          />
        </Link>
        <nav className="nav-links" aria-label="Primary">
          <Link href="/ai-dream-analysis">AI dream analysis</Link>
          <Link href="/dream-analysis-podcast">Podcast</Link>
          <Link href="/dream-journal">Dream journal</Link>
        </nav>
      </div>
      <div className="nav-cta-group">
        <Link href="/signup" className="nav-login-link">
          Sign up
        </Link>
        <Link href="/login" className="nav-login-link">
          Log in
        </Link>
      </div>
    </div>
  );
}
