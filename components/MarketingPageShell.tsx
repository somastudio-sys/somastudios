import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";

type Props = {
  children: React.ReactNode;
};

export default function MarketingPageShell({ children }: Props) {
  return (
    <>
      <header className="site-header site-header--page">
        <SiteNav />
      </header>
      {children}
      <SiteFooter />
    </>
  );
}

export function MarketingPageCta() {
  return (
    <p className="marketing-page-cta">
      <Link href="/signup" className="btn btn-primary">
        Start your dream journal
      </Link>
      <Link href="/login" className="btn btn-ghost">
        Log in
      </Link>
    </p>
  );
}
