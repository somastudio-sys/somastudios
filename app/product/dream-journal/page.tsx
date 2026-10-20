import type { Metadata } from "next";
import Link from "next/link";
import PodcastSpotlight from "@/components/PodcastSpotlight";
import ProductFeatures from "@/components/ProductFeatures";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";

const TITLE = "Dream Journal AI – Dream Journal Online | Soma Studios";
const DESCRIPTION =
  "Soma Studios is a dream journal online with AI dream analysis. Type or speak your dream, save it and read what it might mean in plain English.";

const FAQ = [
  {
    q: "What is a dream journal AI?",
    a: "It's a dream journal that analyses what you write. Soma Studios reads each entry through a Freudian lens and explains it in plain English, so you get more than a page of notes.",
  },
  {
    q: "Can I keep a dream journal online?",
    a: "Yes. Your Soma Studios diary is password-protected and private by default.",
  },
  {
    q: "Can I speak my dream instead of typing it?",
    a: "Yes. Type it, or tap the microphone and say it.",
  },
  {
    q: "Can I edit or delete a dream later?",
    a: "Yes. Entries are saved to your diary, so you can add to one when you remember more, or delete it.",
  },
  {
    q: "What should I write in a dream journal?",
    a: "Whatever you remember, in any order: images, people, places and how the dream felt. A date and a title help, and a fragment is still worth saving.",
  },
  {
    q: "How do I remember my dreams?",
    a: "Write or speak the dream as soon as you wake up, before the detail fades. If more comes back later, open the entry and add it.",
  },
];

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: {
    canonical: "/product/dream-journal",
  },
  openGraph: {
    title: TITLE,
    description:
      "Type or speak your dream, save it, and get an AI Freudian analysis in plain English. Then turn it into a story you navigate yourself.",
    url: "/product/dream-journal",
  },
};

export const revalidate = 3600;

export default function DreamJournalProductPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "Soma Studios",
        url: "https://soma-studios.co.uk/product/dream-journal",
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web browser",
        description:
          "A dream journal online with AI dream analysis through a Freudian lens, and branching stories you navigate yourself.",
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
    ],
  };

  return (
    <>
      <header className="site-header">
        <SiteNav />
        <section className="hero">
          <div className="hero-copy">
            <span className="hero-kicker">
              The AI dream analysis app · Dream journal online
            </span>
            <h1 className="hero-title">
              The AI Dream Journal that records and analyses your dreams
            </h1>
            <p className="hero-subtitle">
              Soma Studios is a dream journal online. Type your dream or speak
              it, save it, and get an AI analysis through a Freudian lens,
              written in plain English. Then turn it into a branching story you
              navigate yourself.
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
                    alt="Soma dream diary: date, title, dream text, record, save and clear"
                    className="hero-window-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </header>

      <ProductFeatures
        heading="What the dream journal does"
        tagline="A dream journal online with AI dream analysis, Freudian interpretation, choose-your-path stories and a private archive. Four features in one place."
        products={[
          {
            image: "/assets/product-moment-diary.png",
            imageAlt: "Writing a dream into the Soma Studios dream journal on a phone",
            label: "Nightly diary",
            title: "Write or speak your dream",
            body: "Type your dream into the journal online, or tap the microphone and say it. Add a date and a title, save it, and edit or delete it whenever you like.",
          },
          {
            image: "/assets/product-moment-freud.png",
            imageAlt: "AI dream analysis of a dream journal entry",
            label: "Freudian lens",
            title: "AI dream analysis",
            body: "Your dream journal entry is read through a Freudian lens, then explained in everyday words. You get a possible meaning, and you decide whether it fits.",
          },
          {
            image: "/assets/product-moment-story.png",
            imageAlt: "Choose-your-path story built from a dream journal entry",
            label: "Story journeys",
            title: "Choose-your-path stories",
            body: "Build your dream into a branching story and navigate it yourself. Seeing it play out can make the odd bits easier to read.",
          },
          {
            image: "/assets/product-moment-archive.png",
            imageAlt: "Private, password-protected dream journal archive",
            label: "Private archive",
            title: "A private dream archive",
            body: "A password-protected diary. Every dream you save stays in one place to come back to.",
          },
        ]}
      />

      <section className="info-section info-section--alt" id="how-it-works">
        <div className="how-inner">
          <span className="hero-kicker">How it works</span>
          <h2>How to use the dream journal online</h2>
          <ol className="how-steps">
            <li>
              <h3>Record your dream in the journal online</h3>
              <p>
                Open your dream journal online and record the entry however you
                prefer, by typing it or tapping Record and speaking it. One
                dream journal tip: capture it as soon as you wake up, then add
                to the entry later if more comes back.
              </p>
            </li>
            <li>
              <h3>Get your AI dream analysis</h3>
              <p>
                The dream journal AI analyses your entry through Freudian dream
                theory. You get a possible meaning for your dream, explained in
                plain English with no psychology background needed.
              </p>
            </li>
            <li>
              <h3>Step into your dream as a story</h3>
              <p>
                Your dream journal entry becomes a branching story you step into
                yourself. You choose where the dream goes next, so you explore
                it instead of only reading about it.
              </p>
            </li>
          </ol>
          <div className="how-cta">
            <Link href="/login" className="btn btn-primary">
              Log in to diary
            </Link>
          </div>
        </div>
      </section>

      <PodcastSpotlight />

      <section className="info-section info-section--soft" id="faq">
        <div className="how-inner">
          <h2>Dream journal questions</h2>
          <div className="product-faq">
            {FAQ.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <div className="marketing-page-outro">
        <h2>Start your dream journal online</h2>
        <p>Save last night’s dream and see what the analysis says.</p>
        <p className="marketing-page-cta">
          <Link href="/login" className="btn btn-primary">
            Log in to diary
          </Link>
          <Link href="/signup" className="btn btn-ghost">
            Sign up
          </Link>
        </p>
      </div>

      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
