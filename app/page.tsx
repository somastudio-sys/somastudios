import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";

const podcastUrl = process.env.NEXT_PUBLIC_PODCAST_URL?.trim();

export const metadata: Metadata = {
  title: "A softer home for your dreams",
  description:
    "Dream diary and gentle Freudian-style reflection in your browser. Password-protected, private by default.",
};

export default function Home() {
  return (
    <>
      <header className="site-header">
        <SiteNav variant="home" />
        <section className="hero">
          <div className="hero-copy">
            <span className="hero-kicker">Dream diary · Freudian analysis</span>
            <h1 className="hero-title">A softer home for your dreams.</h1>
            <p className="hero-subtitle">
              Capture what you see at night and return to it with gentle
              Freudian insight.
            </p>
            <div className="hero-actions">
              <Link href="/login" className="btn btn-primary hero-primary">
                Log in to diary
              </Link>
              {podcastUrl ? (
                <a
                  href={podcastUrl}
                  className="btn btn-ghost hero-secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Listen to the podcast
                </a>
              ) : (
                <Link href="/blog" className="btn btn-ghost hero-secondary">
                  Read the journal
                </Link>
              )}
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

      <section
        id="testimonials"
        className="info-section testimonials-section info-section--alt"
      >
        <div className="info-inner">
          <h2>Customer testimonials</h2>
          <div className="testimonial-carousel" aria-label="Customer testimonials">
            <article className="testimonial-card">
              <p className="testimonial-quote">
                &ldquo;Soma gave my dreams somewhere gentle to land. It turned a
                scattered notes app into a nightly ritual I actually look
                forward to.&rdquo;
              </p>
              <p className="testimonial-name">Dreamer, London</p>
            </article>
            <article className="testimonial-card">
              <p className="testimonial-quote">
                &ldquo;The Freudian prompts helped me spot symbols and patterns
                I&rsquo;d been circling for years. It feels like having a quiet
                analyst in my pocket.&rdquo;
              </p>
              <p className="testimonial-name">Artist, Berlin</p>
            </article>
            <article className="testimonial-card">
              <p className="testimonial-quote">
                &ldquo;Revisiting old entries in Soma feels like screening a
                private film of my subconscious. It&rsquo;s become the calmest
                part of my evening.&rdquo;
              </p>
              <p className="testimonial-name">Writer, New York</p>
            </article>
            <article className="testimonial-card">
              <p className="testimonial-quote">
                &ldquo;I started recording dreams as an experiment. Soma turned
                it into a practice that quietly anchors my week.&rdquo;
              </p>
              <p className="testimonial-name">Researcher, Toronto</p>
            </article>
            <article className="testimonial-card">
              <p className="testimonial-quote">
                &ldquo;There&rsquo;s something about seeing months of dreams in
                one private place that makes my inner life feel held, not
                chaotic.&rdquo;
              </p>
              <p className="testimonial-name">Designer, Copenhagen</p>
            </article>
          </div>
        </div>
      </section>

      <SiteFooter />

      <div id="toast" className="toast" aria-live="polite" />
    </>
  );
}
