type ProductCard = {
  image: string;
  imageAlt: string;
  label: string;
  title: string;
  body: string;
};

const PRODUCTS: ProductCard[] = [
  {
    image: "/assets/product-moment-diary.png",
    imageAlt: "Phone and quill on soft clouds under a crescent moon",
    label: "Nightly diary",
    title: "Record dreams before they fade",
    body: "A distraction-free diary built for the moment you wake up. Type it or speak it — Soma Studios saves it and holds it for when you're ready to look closer.",
  },
  {
    image: "/assets/product-moment-freud.png",
    imageAlt:
      "Open book under a starry sky; a magnifying glass reveals a glowing crescent moon",
    label: "Freudian lens",
    title: "Freudian AI dream analysis",
    body: "Submit your entry and get a Freudian AI reading back — symbols unpacked, patterns surfaced, questions worth sitting with. A lens, not a verdict.",
  },
  {
    image: "/assets/product-moment-story.png",
    imageAlt:
      "Open book with a glowing golden path leading into a starry sky with castles on the clouds",
    label: "Story journeys",
    title: "Turn your dream into a story",
    body: "After your AI analysis, build your dream into a branching story. Pick a genre, make choices, and follow where it goes.",
  },
  {
    image: "/assets/product-moment-archive.png",
    imageAlt:
      "Dream archive on a phone beside leather books, crystals, and a glowing crystal ball",
    label: "Private archive",
    title: "Search your entire dream archive",
    body: "Every entry, every analysis, every story — stored in your browser, searchable across months and years, visible only to you.",
  },
];

type Props = {
  heading?: string;
  tagline?: string;
  headingId?: string;
  sectionId?: string;
};

export default function ProductFeatures({
  heading = "What Soma Studios does",
  tagline = "AI dream analysis, Freudian interpretation, choose-your-path story journeys, and a private archive — four features, one place, nothing leaves your browser.",
  headingId,
  sectionId = "products",
}: Props) {
  return (
    <section id={sectionId || undefined} className="product-section">
      <div className="product-inner">
        <header className="product-header">
          <h2 id={headingId}>{heading}</h2>
          <p className="product-tagline">{tagline}</p>
        </header>
        <div
          className="product-carousel"
          aria-label="Soma product preview carousel"
        >
          {PRODUCTS.map((product) => (
            <figure key={product.label} className="product-card">
              <div className="product-image-frame product-image-moment">
                <img src={product.image} alt={product.imageAlt} />
              </div>
              <figcaption>
                <p className="product-card-label">{product.label}</p>
                <h3>{product.title}</h3>
                <p>{product.body}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
