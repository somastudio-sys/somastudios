import type { Metadata } from "next";
import Link from "next/link";
import PodcastSpotlight from "@/components/PodcastSpotlight";
import ProductFeatures from "@/components/ProductFeatures";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "AI Dream Analysis App & Dream Journal",
  description:
    "Soma Studios is an AI dream journal that analyses your dreams through a Freudian lens — then lets you build them into branching stories you navigate yourself.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Soma Studios — AI Dream Analysis App",
    description:
      "The only dream diary that tells you what it means. Freudian AI analysis, story journeys, private archive.",
    url: "/",
  },
};

export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <header className="site-header">
        <SiteNav />
        <section className="hero">
          <div className="hero-copy">
            <span className="hero-kicker">
              The AI dream analysis app · Dream journal
            </span>
            <h1 className="hero-title">
              The only dream diary that tells you what it means.
            </h1>
            <p className="hero-subtitle">
              Soma Studios is an AI dream journal that analyses your dreams
              through a Freudian lens — then lets you build them into branching
              stories you navigate yourself. Private, in your browser.
            </p>
            <div className="hero-actions">
              <Link href="/login" className="btn btn-primary hero-primary">
                Log in to diary
              </Link>
              <Link
                href="/dream-analysis-podcast"
                className="btn btn-ghost hero-secondary"
              >
                Dream analysis podcast
              </Link>
            </div>
            <p className="hero-meta">
              Password-protected diary · Runs in your browser · Private by default
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
                    alt="Soma dream diary: date, title, dream text, record, save and clear"
                    className="hero-window-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </header>

      <ProductFeatures />

      <PodcastSpotlight />

      <SiteFooter />

      <div id="toast" className="toast" aria-live="polite" />
    </>
  );
}
