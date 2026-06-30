import Link from "next/link";
import { notFound } from "next/navigation";
import { AppCard } from "@/components/app/AppCard";
import { mockDeals } from "@/lib/mock-data";

export function generateStaticParams() { return mockDeals.map((deal) => ({ id: deal.id })); }

export default function DealDetailPage({ params }: { params: { id: string } }) {
  const deal = mockDeals.find((item) => item.id === params.id);
  if (!deal) notFound();
  const resaleMid = Math.round((deal.estimatedResaleLow + deal.estimatedResaleHigh) / 2).toLocaleString();
  const targetHref = deal.messageUrl ?? deal.listingUrl ?? "/app/deal-feed/";
  const valueLabel = deal.underMarketPercent >= 25 ? "Steal" : deal.underMarketPercent >= 10 ? "Fair" : "Overpriced";
  const marker = Math.max(8, Math.min(88, 100 - deal.underMarketPercent));

  return (
    <div className="mx-auto max-w-[430px] pb-8">
      <div className={`relative h-72 overflow-hidden rounded-[22px] border border-line ${detailThumbnailClass(deal.thumbnailTone)}`}>
        <Link href="/app/deal-feed/" className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-black/45 text-xl text-white">Back</Link>
        <div className="absolute right-3 top-3 flex gap-2"><span className="rounded-full bg-black/45 px-3 py-2 text-xs text-white">Save</span><span className="rounded-full bg-black/45 px-3 py-2 text-xs text-white">Share</span></div>
        <span className="absolute bottom-3 left-3 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">{deal.recommendation === "BUY" ? "STEAL" : deal.recommendation}</span>
      </div>

      <div className="mt-4">
        <h1 className="text-2xl font-bold text-ink">{deal.itemName}</h1>
        <p className="mt-1 text-sm text-muted">{deal.source} / Posted {deal.timePosted} / {deal.distance} / {deal.sellerRating ?? "seller rating unavailable"}</p>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Metric label="Asking" value={deal.askingLabel} />
        <Metric label="Est. value" value={deal.estimatedResale} />
        <Metric label="Est. profit" value={deal.estimatedProfit} accent />
      </div>

      <AppCard className="mt-5">
        <div className="flex items-center justify-between gap-3"><div><p className="text-sm text-muted">Value meter</p><h2 className="mt-1 text-lg font-bold text-ink">Estimated value: ${resaleMid}</h2></div><span className="rounded-full bg-brand/12 px-3 py-1 text-sm font-bold text-brand">{valueLabel}</span></div>
        <div className="relative mt-5 h-3 rounded-full value-meter"><span className="absolute top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-info shadow-card" style={{ left: `${marker}%` }} /></div>
        <div className="mt-2 flex justify-between text-[11px] text-muted"><span>Overpriced</span><span>Fair</span><span>Under market</span></div>
        <p className="mt-3 text-sm text-muted">Current listing is estimated {deal.underMarketPercent}% under market based on {deal.similarSalesCount} mock similar sales.</p>
      </AppCard>

      <AppCard className="mt-4 bg-gradient-to-r from-brand/20 to-surface">
        <div className="flex items-center justify-between gap-4"><div><p className="text-sm text-muted">Snagd Score</p><p className="font-mono text-4xl font-bold text-brand">{deal.score}</p><p className="text-sm text-ink">{deal.reason}</p></div><div className="rounded-[14px] bg-brand px-5 py-4 text-center text-white"><p className="text-xl font-bold">{deal.recommendation}</p><p className="text-xs">action rating</p></div></div>
      </AppCard>

      <div className="mt-4 grid grid-cols-3 gap-3"><Info label="Demand" value={deal.demand} /><Info label="Competition" value={deal.competition} /><Info label="Flip speed" value="7-14 days" /></div>

      <AppCard className="mt-4"><h2 className="font-bold text-ink">Profit Breakdown</h2><Break label="Est. resale mid" value={`$${resaleMid}`} /><Break label="Pickup / fees buffer" value="-$18 to -$45" /><Break label="Est. profit" value={deal.estimatedProfit} accent /></AppCard>

      <AppCard className="mt-4"><h2 className="font-bold text-ink">Similar Sales</h2><div className="mt-3 grid gap-2">{deal.similarSales.slice(0, 3).map((sale) => <div key={sale.id} className="rounded-card border border-line bg-surface-2 p-3"><p className="font-bold text-ink">{sale.itemTitle}</p><p className="mt-1 text-sm text-muted">${sale.price} / {sale.condition} / {sale.date}</p></div>)}</div></AppCard>

      <div className="sticky bottom-24 mt-4 grid grid-cols-2 gap-2 rounded-[18px] border border-line bg-surface/95 p-2 shadow-card backdrop-blur">
        <Link href={targetHref} className="rounded-[14px] bg-brand px-4 py-3 text-center font-bold text-white">Message Seller</Link>
        <Link href={deal.listingUrl ?? "/app/deal-feed/"} className="rounded-[14px] border border-line bg-surface-2 px-4 py-3 text-center font-bold text-ink">Open Listing</Link>
        <button className="rounded-[14px] border border-line bg-surface-2 px-4 py-3 text-ink">Save</button>
        <button className="rounded-[14px] border border-line bg-surface-2 px-4 py-3 text-ink">Share</button>
        <Link href="/app/analyze/" className="col-span-2 rounded-[14px] border border-brand/35 bg-brand/10 px-4 py-3 text-center font-bold text-brand">View Similar Sales</Link>
      </div>
    </div>
  );
}

function Metric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) { return <div><p className="text-xs text-muted">{label}</p><p className={`mt-1 font-mono text-base font-bold ${accent ? "text-amber" : "text-ink"}`}>{value}</p></div>; }
function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-[14px] border border-line bg-surface p-3"><p className="text-xs text-muted">{label}</p><p className="mt-1 font-bold text-ink">{value}</p></div>; }
function Break({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) { return <div className="mt-3 flex items-center justify-between border-b border-line pb-2 last:border-b-0"><span className="text-sm text-muted">{label}</span><span className={`font-mono font-bold ${accent ? "text-amber" : "text-ink"}`}>{value}</span></div>; }
function detailThumbnailClass(_tone: string) { return "image-card-violet"; }

