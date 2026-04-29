import Link from "next/link";

export type SiteNavVariant = "home" | "inner";

type Props = {
  variant?: SiteNavVariant;
};

export default function SiteNav({ variant = "inner" }: Props) {
  const hash = (id: string) => (variant === "home" ? `#${id}` : `/#${id}`);

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
          <a href={hash("products")}>Product</a>
          <a href={hash("testimonials")}>Testimonials</a>
          <Link href="/blog">Blog</Link>
        </nav>
      </div>
      <div className="nav-cta-group">
        <Link href="/login" className="nav-login-link">
          Log in
        </Link>
      </div>
    </div>
  );
}
