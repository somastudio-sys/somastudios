import type { Metadata } from "next";
import Link from "next/link";
import MarketingPageShell, {
  MarketingPageCta,
} from "@/components/MarketingPageShell";
import PodcastSpotlight from "@/components/PodcastSpotlight";

export const metadata: Metadata = {
  title: "Dream Analysis Podcast",
  description:
    "Listen to Soma Studios: The Dream Experiment — an AI dream analysis podcast that reads real dreams, unpacks them with Freudian thinking, and turns them into choose-your-own stories.",
  alternates: {
    canonical: "/dream-analysis-podcast",
  },
  openGraph: {
    title: "Dream Analysis Podcast | Soma Studios",
    description:
      "Real dreams, Freudian AI analysis, and branching story journeys — out loud.",
    url: "/dream-analysis-podcast",
  },
};

export const revalidate = 3600;

export default function DreamAnalysisPodcastPage() {
  return (
    <MarketingPageShell>
      <div className="marketing-page-intro">
        <p className="marketing-page-breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true"> / </span>
          <span>Dream analysis podcast</span>
        </p>
        <p className="marketing-page-lede">
          A dream analysis podcast from Soma Studios. Each episode takes a real
          dream diary entry, explores it through a Freudian lens, then reshapes
          it into a genre story you can follow along with.
        </p>
      </div>

      <PodcastSpotlight titleAs="h1" sectionId="" />

      <div className="marketing-page-outro">
        <h2>Try the AI dream journal yourself</h2>
        <p>
          The podcast is the process out loud. The app lets you record your own
          dreams, get Freudian AI analysis, and build branching story journeys —
          privately, in your account.
        </p>
        <MarketingPageCta />
      </div>
    </MarketingPageShell>
  );
}
