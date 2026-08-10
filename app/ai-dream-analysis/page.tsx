import type { Metadata } from "next";
import Link from "next/link";
import MarketingPageShell, {
  MarketingPageCta,
} from "@/components/MarketingPageShell";
import ProductFeatures from "@/components/ProductFeatures";

export const metadata: Metadata = {
  title: "AI Dream Analysis App",
  description:
    "Soma Studios is an AI dream analysis app and dream journal: record dreams, get Freudian interpretation, turn them into branching stories, and keep a private searchable archive.",
  alternates: {
    canonical: "/ai-dream-analysis",
  },
  openGraph: {
    title: "AI Dream Analysis App | Soma Studios",
    description:
      "Record dreams, Freudian AI analysis, story journeys, and a private archive — one AI dream journal.",
    url: "/ai-dream-analysis",
  },
};

export default function AiDreamAnalysisPage() {
  return (
    <MarketingPageShell>
      <div className="marketing-page-intro">
        <p className="marketing-page-breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true"> / </span>
          <span>AI dream analysis</span>
        </p>
        <h1 className="marketing-page-h1">AI dream analysis app</h1>
        <p className="marketing-page-lede">
          Soma Studios is the AI dream journal that tells you what your dreams
          mean. Record what you remember, get Freudian AI analysis, then build
          the dream into a story you navigate yourself.
        </p>
      </div>

      <ProductFeatures
        sectionId=""
        heading="Four features in one dream journal"
        tagline="Nightly diary, Freudian AI dream analysis, choose-your-path story journeys, and a private archive — built for people who take their dreams seriously."
      />

      <div className="marketing-page-outro">
        <h2>Start analysing your dreams</h2>
        <p>
          Create a free account, write or speak your first entry, and see what
          Freudian AI analysis makes of it.
        </p>
        <MarketingPageCta />
        <p className="marketing-page-secondary-links">
          <Link href="/dream-analysis-podcast">Listen to the dream analysis podcast</Link>
          <span aria-hidden="true"> · </span>
          <Link href="/blog">Read the blog</Link>
        </p>
      </div>
    </MarketingPageShell>
  );
}
