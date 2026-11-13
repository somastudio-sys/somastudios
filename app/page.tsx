import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";

export const metadata: Metadata = {
  title: {
    absolute:
      "Dream Journal App | Dream Analysis and Interpretation | Soma Studios",
  },
  description:
    "Soma Studios is an AI dream journal that analyses your dreams through a Freudian lens — then lets you build them into branching stories you navigate yourself.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      "Dream Journal App | Dream Analysis and Interpretation | Soma Studios",
    description:
      "Soma Studios is an AI dream journal that analyses your dreams through a Freudian lens — then lets you build them into branching stories you navigate yourself.",
    url: "/",
  },
};

export default function Home() {
  return (
    <>
      <header className="site-header">
        <SiteNav />
        <section className="hero">
          <div className="hero-copy">
            <h1 className="hero-title">Soma Studios</h1>
            <p className="hero-subtitle">
              An AI dream journal that analyses your dreams through a Freudian
              lens — then lets you turn them into branching stories you navigate
              yourself.
            </p>
            <div className="hero-actions">
              <Link href="/signup" className="btn btn-primary hero-primary">
                Sign up
              </Link>
              <Link href="/login" className="btn btn-ghost hero-secondary">
                Log in
              </Link>
            </div>
            <p className="hero-meta">
              Password-protected diary · Private by default
            </p>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-window">
              <div className="hero-window-bar">
                <span />
                <span />
                <span />
              </div>
              <div className="hero-window-body">
                <div className="hero-window-placeholder">
                  <img
                    src="/assets/hero-diary-preview.png"
                    alt=""
                    className="hero-window-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </header>

      <SiteFooter />

      <div id="toast" className="toast" aria-live="polite" />
    </>
  );
}
