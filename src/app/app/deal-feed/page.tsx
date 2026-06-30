import { DealCard } from "@/components/app/DealCard";
import { mockDeals } from "@/lib/mock-data";

export default function DealFeedPage() {
  return (
    <div className="mx-auto max-w-shell">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-ink">Deal Feed</h2>
          <p className="mt-1 text-sm text-muted">Mock source-layer results sorted by score, profit, and chaseability.</p>
        </div>
        <p className="text-sm text-muted">{mockDeals.length} deals in this demo area</p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {mockDeals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  );
}