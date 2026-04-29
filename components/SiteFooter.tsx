import Link from "next/link";

const year = new Date().getFullYear();

export default function SiteFooter() {
  const contact = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <p className="site-footer-brand">Soma Studios</p>
        <nav className="site-footer-nav" aria-label="Footer">
          <Link href="/">Home</Link>
          <Link href="/blog">Journal</Link>
          <Link href="/login">Log in</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          {contact ? (
            <a href={`mailto:${contact}`}>Contact</a>
          ) : null}
        </nav>
        <p className="site-footer-copy">
          © {year} Soma Studios. Dream diary in your browser—private by default.
        </p>
      </div>
    </footer>
  );
}
