import Link from "next/link";

const POSTS = [
  {
    slug: "why-dreams-matter",
    title: "Why we built a softer place for dreams",
    date: "April 2026",
    excerpt:
      "Dreams are easy to dismiss—until they aren’t. Soma exists to give night-thoughts a calm, private home.",
    body: (
      <>
        <p>
          Most of us wake up and let the images slip away. That’s natural—but
          it also means we lose a whole layer of inner life that’s trying to
          get our attention.
        </p>
        <p>
          Soma Studios is building tools for people who want to stay with that
          layer: a dream diary that feels gentle, optional Freudian-style
          reflection when you want it, and a path to turn dreams into creative
          work—without turning your subconscious into a performance.
        </p>
        <p>
          This blog is where we’ll share how we think about dreams, creativity,
          and privacy. The diary itself stays yours.
        </p>
      </>
    ),
  },
  {
    slug: "freud-without-the-freight",
    title: "Freudian insight, without the freight",
    date: "April 2026",
    excerpt:
      "Classical psychoanalysis isn’t a lifestyle brand—but its questions can still be useful.",
    body: (
      <>
        <p>
          We’re not here to diagnose anyone. What we borrow from Freud is a set
          of <em>questions</em>: What might sit beneath the surface of a dream?
          What gets displaced or condensed into symbols? Where might wish and
          fear mingle?
        </p>
        <p>
          Soma’s analysis features are framed as reflection, not verdicts. You
          stay in charge of what you do with what comes back.
        </p>
      </>
    ),
  },
  {
    slug: "privacy-by-design",
    title: "Privacy by design",
    date: "April 2026",
    excerpt:
      "Your dreams don’t need to live on a billboard. Here’s how we think about data.",
    body: (
      <>
        <p>
          Dream content is sensitive. The core diary experience is built so
          your entries can stay on your device unless you choose to use
          cloud-based features—and we’ll always be clear when something leaves
          your machine.
        </p>
        <p>
          As we grow, we’ll document exactly what gets sent where. For now, read
          our product pages and this blog for the latest on how Soma handles
          your inner life with care.
        </p>
      </>
    ),
  },
];

export default function MarketingBlogClient() {
  return (
    <div className="marketing-blog">
      <header className="marketing-blog-hero">
        <div className="marketing-blog-hero-inner">
          <Link href="/" className="marketing-blog-back">
            ← Soma Studios
          </Link>
          <h1 className="marketing-blog-h1">Journal</h1>
          <p className="marketing-blog-dek">
            Ideas, updates, and how we think about dreams and creativity—so you
            can see what Soma stands for before you download.
          </p>
        </div>
      </header>

      <main className="marketing-blog-main">
        <ul className="marketing-post-list">
          {POSTS.map((post) => (
            <li key={post.slug} id={post.slug} className="marketing-post">
              <article>
                <header className="marketing-post-header">
                  <p className="marketing-post-date">{post.date}</p>
                  <h2>{post.title}</h2>
                  <p className="marketing-post-excerpt">{post.excerpt}</p>
                </header>
                <div className="marketing-post-body">{post.body}</div>
              </article>
            </li>
          ))}
        </ul>

        <p className="marketing-blog-cta">
          <Link href="/#download" className="btn btn-primary">
            Get Soma
          </Link>
        </p>
      </main>
    </div>
  );
}
