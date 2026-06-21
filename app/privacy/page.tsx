import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "Privacy | Soma Studios",
  description:
    "How Soma handles your dream diary data—in plain language. Not medical advice.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <header className="site-header site-header--page">
        <SiteNav variant="inner" />
      </header>
      <main className="legal-page">
        <div className="legal-page-inner">
          <p className="legal-back">
            <Link href="/">← Home</Link>
          </p>
          <h1>Privacy</h1>
          <p className="legal-lede">
            Your dreams are personal. This page explains, in plain terms, how
            Soma approaches data for the current product—without legal jargon
            where we can help it.
          </p>

          <h2>Your account</h2>
          <p>
            Each person signs up with their own email and password. Dreams and
            saved stories are stored in a secure cloud database, scoped to your
            account—so your archive survives clearing browser cache as long as
            you log back in.
          </p>
          <p>
            If you used an older version that kept data only in the browser,
            any entries still in local storage are imported into your cloud
            archive the first time you open the diary after an update.
          </p>

          <h2>Export and deletion</h2>
          <p>
            From Settings in the diary you can export your full archive as a
            PDF, delete all dreams, or delete all repurposed stories. These
            actions apply only to your account.
          </p>

          <h2>When you use “Analyse (Freud)” or Story journey</h2>
          <p>
            Those features send the relevant dream text (and, for stories, your
            saved analysis) to our server, which calls the OpenAI API to
            generate text. Your OpenAI API key for the project lives on the
            server—not in the browser. We do not use your dreams to train
            public models; we use the API as a one-off generation step for your
            request.
          </p>

          <h2>Password</h2>
          <p>
            Your password is stored as a one-way hash—we never keep the plain
            text. Use a strong, unique password and keep it private.
          </p>

          <h2>Not medical or therapeutic advice</h2>
          <p>
            Soma is a creative and reflective tool. It does not diagnose
            conditions or replace a qualified clinician. If you are in crisis,
            contact local emergency services or a trusted professional.
          </p>

          <h2>Changes</h2>
          <p>
            As the product grows, we may update this page. Check the journal or
            release notes when we ship features that move data off your device.
          </p>

          <p className="legal-meta">
            Last updated April {new Date().getFullYear()}.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
