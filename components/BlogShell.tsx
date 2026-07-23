import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";

type Props = {
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
};

export default function BlogShell({
  children,
  backHref = "/dream-journal",
  backLabel = "← Dream journal",
}: Props) {
  return (
    <div className="marketing-blog">
      <header className="site-header site-header--page">
        <SiteNav />
      </header>
      {backHref ? (
        <p className="blog-article-back-wrap">
          <Link href={backHref} className="marketing-blog-back">
            {backLabel}
          </Link>
        </p>
      ) : null}
      {children}
      <SiteFooter />
    </div>
  );
}
