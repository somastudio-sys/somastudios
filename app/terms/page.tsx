import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "Terms of use | Soma Studios",
  description:
    "Terms for using Soma Studios websites and the Soma dream diary experience.",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <>
      <header className="site-header site-header--page">
        <SiteNav />
      </header>
      <main className="legal-page">
        <div className="legal-page-inner">
          <p className="legal-back">
            <Link href="/">← Home</Link>
          </p>
          <h1>Terms of use</h1>
          <p className="legal-lede">
            By using Soma Studios websites and software (including the dream
            diary), you agree to these terms. If you do not agree, please do not
            use the service.
          </p>

          <h2>The service</h2>
          <p>
            Soma is provided as-is, for personal, non-commercial use unless we
            agree otherwise in writing. We may change or discontinue features at
            any time.
          </p>

          <h2>No medical advice</h2>
          <p>
            Nothing in Soma is professional medical, psychological, or
            psychiatric advice. Analysis and stories are for reflection and
            creativity only. Always seek qualified help for health concerns.
          </p>

          <h2>Your content</h2>
          <p>
            You retain rights to the dreams and text you enter. You are
            responsible for what you submit and for keeping your credentials
            safe.
          </p>

          <h2>Acceptable use</h2>
          <p>
            Do not misuse the service, attempt to break security, or use it in
            violation of applicable law. We may suspend access if needed to
            protect the service or others.
          </p>

          <h2>Liability</h2>
          <p>
            To the maximum extent permitted by law, Soma Studios is not liable
            for indirect or consequential damages arising from your use of the
            service. The service is provided without warranties of any kind.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms? Use the contact link in the footer if
            an email is configured for this deployment.
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
