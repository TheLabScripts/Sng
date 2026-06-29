import { marketplaces } from "@/content/site";

export function MarketplaceStrip() {
  return (
    <div className="border-y border-line bg-surface/30 py-6">
      <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        Score listings from where you already hunt
      </p>
      <div className="mx-auto flex max-w-shell flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5">
        {marketplaces.map((m) => (
          <span key={m} className="text-sm font-semibold text-muted/90">
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
