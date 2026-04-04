import Link from "next/link";

export default function Home() {
  return (
    <>
      <header className="site-header">
        <div className="nav-bar">
          <div className="nav-brand">
            {/* Add your logo at public/assets/soma-studio-logo.png */}
            <img
              src="/assets/soma-studio-logo.png"
              alt="Soma Studios logo"
              className="nav-brand-logo"
            />
            <span>Soma Studios</span>
          </div>
          <nav className="nav-links">
            <a href="#about">About us</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#products">Product</a>
            <Link href="/blog">Blog</Link>
            <a href="#download">Download</a>
          </nav>
          <div className="nav-cta-group">
            <Link href="/login" className="nav-login-link">
              Log in
            </Link>
            <a href="#download" className="nav-download-btn">
              Download
            </a>
          </div>
        </div>

        <section className="hero">
          <div className="hero-copy">
            <span className="hero-kicker">Dream diary · Freudian analysis</span>
            <h1 className="hero-title">A softer home for your dreams.</h1>
            <p className="hero-subtitle">
              Capture what you see at night and return to it with gentle
              Freudian insight.
            </p>
            <div className="hero-actions">
              <a href="#download" className="btn btn-primary hero-primary">
                Download Soma
              </a>
              <Link href="/diary" className="btn btn-ghost hero-secondary">
                Log in to diary
              </Link>
            </div>
            <p className="hero-meta">Available for desktop. Private by default.</p>
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
                    alt="Preview of the Soma dream diary interface"
                    className="hero-window-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </header>

      <section id="about" className="info-section">
        <div className="info-inner">
          <h2>About us</h2>
          <p className="about-copy">
            Soma Studios is a small team building tools for dreamers. We believe
            the things that surface at night deserve a gentle, private place to
            land—and that returning to them with curiosity can bring clarity and
            calm.
          </p>
        </div>
      </section>

      <section id="products" className="product-section">
        <div className="product-inner">
          <header className="product-header">
            <h2>Soma, in three moments</h2>
            <p className="product-tagline">
              A calm diary, a gentle analysis engine, and a private archive –
              shown here as product previews.
            </p>
          </header>
          <div
            className="product-carousel"
            aria-label="Soma product preview carousel"
          >
            <figure className="product-card">
              <div className="product-image-frame">
                <img
                  src="/assets/hero-diary-preview.png"
                  alt="Preview of the Soma nightly diary entry surface"
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
              <div className="product-image-frame product-image-placeholder">
                <span>Freudian analysis view</span>
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
              <div className="product-image-frame product-image-placeholder">
                <span>Private archive view</span>
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

      <section id="download" className="download-section">
        <div className="download-inner">
          <h2>Download Soma</h2>
          <p className="download-tagline">
            Available for desktop. Private by default.
          </p>
          <a href="#download" className="btn btn-primary btn-large">
            Download for Mac / Windows
          </a>
        </div>
      </section>

      <div id="toast" className="toast" aria-live="polite" />
    </>
  );
}
