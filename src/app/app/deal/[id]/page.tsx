import Link from "next/link";
import { notFound } from "next/navigation";
import { AppCard } from "@/components/app/AppCard";
import { mockDeals } from "@/lib/mock-data";

export function generateStaticParams() {
  return mockDeals.map((deal) => ({ id: deal.id }));
}

export default function DealDetailPage({ params }: { params: { id: string } }) {
  const deal = mockDeals.find((item) => item.id === params.id);
  if (!deal) notFound();

  const resaleMid = Math.round((deal.estimatedResaleLow + deal.estimatedResaleHigh) / 2).toLocaleString();

  return (
    <div className="mx-auto max-w-[430px] pb-8">
      <div className={`relative h-64 overflow-hidden rounded-[22px] border border-line ${detailThumbnailClass(deal.thumbnailTone)}`}>
        <Link href="/app/deal-feed/" className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-black/45 text-xl text-ink">
          ‹
        </Link>
        <span className="absolute right-3 top-3 rounded-full bg-black/45 px-3 py-1 text-xs text-ink">1 / 12</span>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">{deal.itemName}</h1>
          <p className="mt-1 text-sm text-muted">{deal.source} / Posted {deal.timePosted} / {deal.distance}</p>
        </div>
        <button className="rounded-card border border-line px-3 py-2 text-sm text-muted">♡</button>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Metric label="Asking" value={deal.askingLabel} />
        <Metric label="Est. Resale Range" value={deal.estimatedResale} />
        <Metric label="Est. Profit" value={deal.estimatedProfit} accent />
      </div>

      <AppCard className="mt-5 bg-gradient-to-r from-brand/25 to-surface">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted">Snagd Score</p>
            <p className="font-mono text-3xl font-bold text-brand">{deal.score}</p>
            <p className="text-sm text-ink">{deal.recommendation === "BUY" ? "Excellent opportunity" : "Needs verification"}</p>
          </div>
          <div className="rounded-[14px] bg-brand px-7 py-4 text-center text-bg shadow-glow">
            <p className="text-2xl font-bold">{deal.recommendation}</p>
            <p className="text-sm">Strong Buy</p>
          </div>
        </div>
      </AppCard>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <Info label="Demand" value={deal.demand} />
        <Info label="Competition" value={deal.competition} />
        <Info label="Flip Speed" value="7-14 days" />
      </div>

      <AppCard className="mt-4">
        <h2 className="font-bold text-ink">Profit Breakdown</h2>
        <Break label="Est. Resale (Mid)" value={`$${resaleMid}`} />
        <Break label="After fees & costs" value="-$1,900" />
        <Break label="Est. Profit" value={deal.estimatedProfit} accent />
      </AppCard>

      <div className="sticky bottom-24 mt-4 grid grid-cols-[1.4fr_0.8fr_0.8fr] gap-2">
        <button className="rounded-[14px] bg-brand px-4 py-3 font-bold text-bg shadow-glow">Message Seller</button>
        <button className="rounded-[14px] border border-line bg-surface px-4 py-3 text-ink">Save</button>
        <button className="rounded-[14px] border border-line bg-surface px-4 py-3 text-ink">Share</button>
      </div>
    </div>
  );
}

function Metric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className={`mt-1 font-mono text-base font-bold ${accent ? "text-amber" : "text-ink"}`}>{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[14px] border border-line bg-surface p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-bold text-ink">{value}</p>
    </div>
  );
}

function Break({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="mt-3 flex items-center justify-between border-b border-line pb-2 last:border-b-0">
      <span className="text-sm text-muted">{label}</span>
      <span className={`font-mono font-bold ${accent ? "text-amber" : "text-ink"}`}>{value}</span>
    </div>
  );
}

function detailThumbnailClass(tone: string) {
  const classes: Record<string, string> = {
    violet: "image-card-violet",
    slate: "image-card-violet",
    amber: "image-card-violet",
    rose: "image-card-violet",
    cyan: "image-card-violet",
    emerald: "image-card-violet"
  };

  return classes[tone] ?? "image-card-violet";
}
