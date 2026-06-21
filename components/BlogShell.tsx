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
  backHref = "/blog",
  backLabel = "← Journal",
}: Props) {
  return (
    <div className="marketing-blog">
      <header className="site-header site-header--page">
        <SiteNav variant="inner" />
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
