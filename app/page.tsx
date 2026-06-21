import type { Metadata } from "next";
import Link from "next/link";
import PodcastSpotlight from "@/components/PodcastSpotlight";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { getPodcastChannelUrl } from "@/lib/podcastFeed";

const podcastUrl = getPodcastChannelUrl();

export const metadata: Metadata = {
  title: "The AI dream analysis app",
  description:
    "Tell Soma your dream. Get Freudian AI analysis back. Turn it into a branching story—stored privately in your browser.",
};

export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <header className="site-header">
        <SiteNav variant="home" />
        <section className="hero">
          <div className="hero-copy">
            <span className="hero-kicker">The AI dream analysis app</span>
            <h1 className="hero-title">
              Your dreams mean something. Find out what.
            </h1>
            <p className="hero-subtitle">
              Tell Soma your dream. Get Freudian AI analysis back. Then turn it
              into a branching story you navigate yourself — stored privately in
              your browser.
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
              Password-protected diary · In your browser · Private by default
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
            <h2>Soma, in four moments</h2>
            <p className="product-tagline">
              A calm diary, a gentle analysis engine, choose-your-path stories
              inspired by your dreams, and a private archive—shown here as
              product previews.
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
                <h3>Nightly diary</h3>
                <p>
                  Capture what surfaced in the dark with a soft,
                  distraction-free writing surface.
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
                <h3>Freudian lens</h3>
                <p>
                  Return to your entries with gentle prompts drawn from classic
                  psychoanalytic thinking.
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
                <h3>Story journeys</h3>
                <p>
                  After you analyse a dream, turn it into a short interactive
                  tale: pick a genre and branch through a few paths—then save
                  your repurposed story.
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
                <h3>Private archive</h3>
                <p>
                  Keep an ordered, searchable record of dreams over months and
                  years, just for you.
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
