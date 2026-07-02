import { Container } from "./Container";

const quotes = [
  {
    quote:
      "I stopped doom-scrolling Marketplace at midnight. Snagd tells me what's worth the drive and I skip the rest.",
    name: "Marcus T.",
    role: "Furniture flipper / Ohio",
  },
  {
    quote:
      "The max-offer number alone paid for it. I used to overpay on tools - now I walk in knowing my ceiling.",
    name: "Dani R.",
    role: "Tool & electronics reseller / Texas",
  },
];

export function Testimonial() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="grid gap-4 md:grid-cols-2">
        {quotes.map((q) => (
          <figure
            key={q.name}
            className="rounded-card border border-line bg-surface p-7 shadow-card"
          >
            <blockquote className="font-display text-lg font-semibold leading-snug text-ink">
              &ldquo;{q.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand/15 font-mono text-sm font-bold text-brand">
                {q.name.charAt(0)}
              </span>
              <span className="text-sm">
                <span className="block font-semibold text-ink">{q.name}</span>
                <span className="block text-muted">{q.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-widest text-muted">
        Illustrative - shown to demonstrate the product
      </p>
    </Container>
  );
}
