import Link from "next/link";

type Props = {
  title?: string;
  copy?: string;
  buttonHref?: string;
  buttonLabel?: string;
};

export default function BlogCtaCard({
  title = "Try Soma Studios",
  copy = "Record a dream, get Freudian AI analysis, and turn it into a story you navigate yourself — private, in your browser.",
  buttonHref = "/signup",
  buttonLabel = "Start your dream journal",
}: Props) {
  return (
    <div className="blog-cta-card">
      <h2 className="blog-cta-title">{title}</h2>
      <p className="blog-cta-copy">{copy}</p>
      <Link href={buttonHref} className="btn blog-cta-btn">
        {buttonLabel}
      </Link>
      <p className="blog-cta-secondary">
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </div>
  );
}
