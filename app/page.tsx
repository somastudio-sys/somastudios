import type { Metadata } from "next";
import Link from "next/link";
import PodcastSpotlight from "@/components/PodcastSpotlight";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { getPodcastChannelUrl } from "@/lib/podcastFeed";

const podcastUrl = getPodcastChannelUrl();

export const metadata: Metadata = {
  title: "The only dream diary that tells you what it means",
  description:
    "Soma Studios is an AI dream journal that analyses your dreams through a Freudian lens — then lets you build them into branching stories you navigate yourself. Private, in your browser.",
};

export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <header className="site-header">
        <SiteNav variant="home" />
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
              <a
                href={podcastUrl}
                className="btn btn-ghost hero-secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Listen to the podcast
              </a>
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

      <section id="products" className="product-section">
        <div className="product-inner">
          <header className="product-header">
            <h2>What Soma Studios does</h2>
            <p className="product-tagline">
              AI dream analysis, Freudian interpretation, choose-your-path story
              journeys, and a private archive — four features, one place, nothing
              leaves your browser.
            </p>
          </header>
          <div
            className="product-carousel"
            aria-label="Soma product preview carousel"
          >
            <figure className="product-card">
              <div className="product-image-frame product-image-moment">
                <img
                  src="/assets/product-moment-diary.png"
                  alt="Phone and quill on soft clouds under a crescent moon"
                />
              </div>
              <figcaption>
                <p className="product-card-label">Nightly diary</p>
                <h3>Record dreams before they fade</h3>
                <p>
                  A distraction-free diary built for the moment you wake up.
                  Type it or speak it — Soma Studios saves it and holds it for
                  when you&apos;re ready to look closer.
                </p>
              </figcaption>
            </figure>
            <figure className="product-card">
              <div className="product-image-frame product-image-moment">
                <img
                  src="/assets/product-moment-freud.png"
                  alt="Open book under a starry sky; a magnifying glass reveals a glowing crescent moon"
                />
              </div>
              <figcaption>
                <p className="product-card-label">Freudian lens</p>
                <h3>Freudian AI dream analysis</h3>
                <p>
                  Submit your entry and get a Freudian AI reading back — symbols
                  unpacked, patterns surfaced, questions worth sitting with. A
                  lens, not a verdict.
                </p>
              </figcaption>
            </figure>
            <figure className="product-card">
              <div className="product-image-frame product-image-moment">
                <img
                  src="/assets/product-moment-story.png"
                  alt="Open book with a glowing golden path leading into a starry sky with castles on the clouds"
                />
              </div>
              <figcaption>
                <p className="product-card-label">Story journeys</p>
                <h3>Turn your dream into a story</h3>
                <p>
                  After your AI analysis, build your dream into a branching
                  story. Pick a genre, make choices, and follow where it goes.
                </p>
              </figcaption>
            </figure>
            <figure className="product-card">
              <div className="product-image-frame product-image-moment">
                <img
                  src="/assets/product-moment-archive.png"
                  alt="Dream archive on a phone beside leather books, crystals, and a glowing crystal ball"
                />
              </div>
              <figcaption>
                <p className="product-card-label">Private archive</p>
                <h3>Search your entire dream archive</h3>
                <p>
                  Every entry, every analysis, every story — stored in your
                  browser, searchable across months and years, visible only to
                  you.
                </p>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <PodcastSpotlight />

      <SiteFooter />

      <div id="toast" className="toast" aria-live="polite" />
    </>
  );
}
