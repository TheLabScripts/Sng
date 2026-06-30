import { Container } from "./Container";
import { Bolt } from "./icons";

export function EverythingMode() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="relative overflow-hidden rounded-card border border-brand/30 bg-gradient-to-br from-surface to-surface-2 p-8 shadow-glow sm:p-12">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand/10 blur-3xl" aria-hidden />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-brand">
            <Bolt className="h-3.5 w-3.5" /> Everything Mode
          </span>
          <h3 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Don&rsquo;t want a niche? Flip anything with a margin.
          </h3>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Some hustlers don&rsquo;t care what it is â€” if there&rsquo;s profit, they&rsquo;re in.
            Everything Mode watches your area for any local item with real upside, based on your
            budget, profit target, and pickup distance. Furniture today, a tool bundle tomorrow,
            a free dresser on the curb tonight.
          </p>
        </div>
      </div>
    </Container>
  );
}


