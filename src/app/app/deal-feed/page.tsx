import { DealCard } from "@/components/app/DealCard";
import { mockDeals } from "@/lib/mock-data";

export default function DealFeedPage() {
  return (
    <div className="mx-auto max-w-[430px] md:max-w-shell">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div><h2 className="text-2xl font-bold text-ink">Feed</h2><p className="mt-1 text-sm text-muted">High-score local opportunities sorted by actionability.</p></div>
        <span className="rounded-full border border-brand/35 bg-brand/10 px-3 py-1 text-xs font-bold text-brand">{mockDeals.length} deals</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">{mockDeals.map((deal) => <DealCard key={deal.id} deal={deal} />)}</div>
    </div>
  );
}