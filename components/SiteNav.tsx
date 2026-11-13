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
