"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppCard } from "@/components/app/AppCard";
import { thumbnailClass } from "@/components/app/DealCard";
import { readJson, writeJson } from "@/lib/storage/snagdStorage";
import type { Deal, DealStatus, SimilarSale } from "@/types/snagd";

const savedKey = "snagd-saved-deal-ids";
const statusKey = "snagd-deal-statuses";
const dealStatuses: DealStatus[] = ["New", "Saved", "Messaged Seller", "Planning Pickup", "Bought", "Passed", "Lost / Sold to Someone Else", "Listed for Resale", "Sold"];

export function DealDetailClient({ deal }: { deal: Deal }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<Record<string, DealStatus>>({});
  const [feedback, setFeedback] = useState("");
  const [similarOpen, setSimilarOpen] = useState(false);
  const [trackOpen, setTrackOpen] = useState(false);

  useEffect(() => {
    setSavedIds(readJson(savedKey, []));
    setStatuses(readJson(statusKey, {}));
  }, []);

  const saved = savedIds.includes(deal.id);
  const status = statuses[deal.id] ?? deal.status ?? "New";
  const resaleMidValue = Math.round((deal.estimatedResaleLow + deal.estimatedResaleHigh) / 2);
  const resaleMid = resaleMidValue.toLocaleString();
  const valueLabel = deal.underMarketPercent >= 25 ? "Steal" : deal.underMarketPercent >= 10 ? "Fair" : "Overpriced";
  const marker = Math.max(8, Math.min(88, 100 - deal.underMarketPercent));

  function pulse(message: string) {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 1700);
  }

  function toggleSaved() {
    const next = saved ? savedIds.filter((id) => id !== deal.id) : [...savedIds, deal.id];
    setSavedIds(next);
    writeJson(savedKey, next);
    pulse(saved ? "Removed from saved" : "Saved deal");
  }

  function openListing() {
    if (deal.listingUrl) window.open(deal.listingUrl, "_blank", "noopener,noreferrer");
    else pulse("No source listing URL provided");
  }

  function messageSeller() {
    if (deal.messageUrl) window.open(deal.messageUrl, "_blank", "noopener,noreferrer");
    else if (deal.listingUrl) window.open(deal.listingUrl, "_blank", "noopener,noreferrer");
    else pulse("This source did not provide a direct message link");
  }

  async function shareDeal() {
    const text = `Deal found on Snagd: ${deal.itemName} - Estimated profit: ${deal.estimatedProfit}, Snagd Score: ${deal.score}. Get Snagd to find local flips worth chasing.`;
    if (navigator.share) {
      await navigator.share({ title: deal.itemName, text, url: deal.listingUrl ?? window.location.href });
      pulse("Share opened");
      return;
    }
    await navigator.clipboard.writeText(text);
    pulse("Copied share text");
  }

  function setStatus(nextStatus: DealStatus) {
    const next = { ...statuses, [deal.id]: nextStatus };
    setStatuses(next);
    writeJson(statusKey, next);
    pulse(`Marked ${nextStatus}`);
  }

  return (
    <div className="mx-auto max-w-[430px] pb-8">
      <div className={`relative h-72 overflow-hidden rounded-[22px] border border-line ${thumbnailClass(deal.thumbnailTone)}`}>
        <Link href="/app/deal-feed/" className="absolute left-3 top-3 grid h-10 min-w-10 place-items-center rounded-full bg-black/45 px-3 text-sm font-bold text-white">Back</Link>
        <div className="absolute right-3 top-3 flex gap-2"><button onClick={toggleSaved} className={`rounded-full px-3 py-2 text-xs font-bold text-white ${saved ? "bg-profit" : "bg-black/45"}`}>{saved ? "Saved" : "Save"}</button><button onClick={shareDeal} className="rounded-full bg-black/45 px-3 py-2 text-xs font-bold text-white">Share</button></div>
        <span className="absolute bottom-3 left-3 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">{deal.recommendation === "BUY" ? "STEAL" : deal.recommendation}</span>
        <span className="absolute bottom-3 right-3 rounded-full bg-profit px-3 py-1 text-xs font-bold text-white">{deal.estimatedProfit}</span>
      </div>

      <div className="mt-4"><h1 className="text-2xl font-bold text-ink">{deal.itemName}</h1><p className="mt-1 text-sm text-muted">{deal.source} / Posted {deal.timePosted} / {deal.distance} / {deal.sellerRating ?? "seller rating unavailable"}</p></div>

      <div className="mt-5 grid grid-cols-3 gap-3"><Metric label="Asking" value={deal.askingLabel} /><Metric label="Est. value" value={deal.estimatedResale} /><Metric label="Est. profit" value={deal.estimatedProfit} accent /></div>

      <AppCard className="mt-5"><div className="flex items-center justify-between gap-3"><div><p className="text-sm text-muted">Value meter</p><h2 className="mt-1 text-lg font-bold text-ink">Estimated value: ${resaleMid}</h2></div><span className="rounded-full bg-profit/12 px-3 py-1 text-sm font-bold text-profit">{valueLabel}</span></div><div className="relative mt-5 h-3 rounded-full value-meter"><span className="absolute top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-info shadow-card" style={{ left: `${marker}%` }} /></div><div className="mt-2 flex justify-between text-[11px] text-muted"><span>Overpriced</span><span>Fair</span><span>Under market</span></div><p className="mt-3 text-sm text-muted">Current listing is estimated <span className="font-bold text-profit">{deal.underMarketPercent}% under market</span> based on {deal.similarSalesCount} mock similar sales.</p></AppCard>

      <AppCard className="mt-4 bg-gradient-to-r from-brand/14 to-surface"><div className="flex items-center justify-between gap-4"><div><p className="text-sm text-muted">Snagd Score</p><p className="font-mono text-4xl font-bold text-brand">{deal.score}</p><p className="mt-1 text-sm text-muted">Based on {deal.similarSalesCount} similar sales / Demand: {deal.demand} / Competition: {deal.competition} / Confidence: {deal.confidence}</p></div><div className="rounded-[14px] bg-brand px-5 py-4 text-center text-white"><p className="text-xl font-bold">{deal.recommendation}</p><p className="text-xs">action rating</p></div></div><div className="mt-4 flex flex-wrap gap-2">{deal.reasonTags.slice(0, 5).map((tag) => <span key={tag} className={`rounded-full border px-2.5 py-1 text-[11px] ${tag.toLowerCase().includes("risk") ? "border-pass/25 bg-pass/10 text-pass" : "border-profit/25 bg-profit/10 text-profit"}`}>{tag}</span>)}</div></AppCard>

      <div className="mt-4 grid grid-cols-3 gap-3"><Info label="Demand" value={deal.demand} /><Info label="Competition" value={deal.competition} /><Info label="Status" value={status} /></div>

      <AppCard className="mt-4"><h2 className="font-bold text-ink">Profit Breakdown</h2><Break label="Est. resale mid" value={`$${resaleMid}`} /><Break label="Pickup / fees buffer" value="-$18 to -$45" /><Break label="Est. profit" value={deal.estimatedProfit} accent /></AppCard>

      <AppCard className="mt-4"><div className="flex items-center justify-between gap-3"><h2 className="font-bold text-ink">Similar Sales</h2><button onClick={() => setSimilarOpen(true)} className="text-sm font-bold text-brand">View all</button></div><div className="mt-3 grid gap-2">{deal.similarSales.slice(0, 3).map((sale) => <SimilarSaleRow key={sale.id} sale={sale} />)}</div></AppCard>

      <div className="sticky bottom-24 mt-4 grid grid-cols-2 gap-2 rounded-[18px] border border-line bg-surface/95 p-2 shadow-card backdrop-blur"><button onClick={messageSeller} className="rounded-[14px] bg-brand px-4 py-3 text-center font-bold text-white">Message Seller</button><button onClick={openListing} className="rounded-[14px] border border-line bg-surface-2 px-4 py-3 text-center font-bold text-ink">Open Listing</button><button onClick={toggleSaved} className="rounded-[14px] border border-line bg-surface-2 px-4 py-3 text-ink">{saved ? "Saved" : "Save"}</button><button onClick={shareDeal} className="rounded-[14px] border border-line bg-surface-2 px-4 py-3 text-ink">Share</button><button onClick={() => setSimilarOpen(true)} className="rounded-[14px] border border-brand/35 bg-brand/10 px-4 py-3 font-bold text-brand">View Similar Sales</button><button onClick={() => setTrackOpen(true)} className="rounded-[14px] border border-profit/35 bg-profit/10 px-4 py-3 font-bold text-profit">Track Outcome</button></div>

      {feedback && <p className="fixed bottom-28 left-1/2 z-[90] w-[min(360px,calc(100vw-24px))] -translate-x-1/2 rounded-full border border-brand/35 bg-surface px-4 py-2 text-center text-sm font-bold text-brand shadow-card motion-slide">{feedback}</p>}
      {similarOpen && <SimilarSalesSheet dealTitle={deal.itemName} sales={deal.similarSales} onClose={() => setSimilarOpen(false)} />}
      {trackOpen && <TrackingSheet deal={deal} status={status} onStatus={setStatus} onClose={() => setTrackOpen(false)} />}
    </div>
  );
}

function SimilarSalesSheet({ dealTitle, sales, onClose }: { dealTitle: string; sales: SimilarSale[]; onClose: () => void }) { return <div className="fixed inset-0 z-[80] grid place-items-end bg-black/50 p-3 sm:place-items-center" role="dialog" aria-modal="true"><div className="motion-slide max-h-[86vh] w-full max-w-lg overflow-auto rounded-[22px] border border-line bg-surface p-4 shadow-card"><div className="flex items-start justify-between gap-3"><div><p className="text-sm text-muted">Similar Sales</p><h3 className="text-xl font-bold text-ink">{dealTitle}</h3></div><button onClick={onClose} className="rounded-card border border-line px-3 py-2 text-sm text-muted">Close</button></div><div className="mt-4 grid gap-3">{sales.length ? sales.map((sale) => <SimilarSaleRow key={sale.id} sale={sale} />) : <p className="rounded-card border border-line bg-surface-2 p-3 text-sm text-muted">No comps are attached to this mock listing yet.</p>}</div></div></div>; }
function SimilarSaleRow({ sale }: { sale: SimilarSale }) { return <div className="rounded-card border border-line bg-surface-2 p-3"><div className="flex gap-3"><div className={`h-14 w-14 shrink-0 rounded-card ${thumbnailClass(sale.thumbnailTone)}`} /><div><p className="font-bold text-ink">{sale.itemTitle}</p><p className="mt-1 text-sm text-muted">${sale.price} / {sale.condition} / {sale.source} / {sale.date}</p><p className="mt-1 text-xs text-muted">{sale.matchConfidence} confidence. {sale.notes}</p></div></div></div>; }
function TrackingSheet({ deal, status, onStatus, onClose }: { deal: Deal; status: DealStatus; onStatus: (status: DealStatus) => void; onClose: () => void }) { const [localStatus, setLocalStatus] = useState<DealStatus>(status); const [purchasePrice, setPurchasePrice] = useState(deal.askingPrice); const [pickupCost, setPickupCost] = useState(18); const [repairCost, setRepairCost] = useState(0); const [soldPrice, setSoldPrice] = useState(deal.estimatedResaleLow); const [sellingFees, setSellingFees] = useState(12); const realProfit = soldPrice - purchasePrice - pickupCost - repairCost - sellingFees; const roi = purchasePrice > 0 ? Math.round((realProfit / purchasePrice) * 100) : 100; return <div className="fixed inset-0 z-[80] grid place-items-end bg-black/50 p-3 sm:place-items-center"><div className="motion-slide max-h-[88vh] w-full max-w-lg overflow-auto rounded-[22px] border border-line bg-surface p-4 shadow-card"><div className="flex items-start justify-between gap-3"><div><p className="text-sm text-muted">Deal Tracking</p><h3 className="text-xl font-bold text-ink">{deal.itemName}</h3></div><button onClick={onClose} className="rounded-card border border-line px-3 py-2 text-sm text-muted">Close</button></div><p className="mt-3 rounded-card border border-amber/30 bg-amber/10 p-3 text-sm text-amber">This listing looks unavailable. Did you buy it?</p><div className="mt-4 grid gap-3"><select className="rounded-card border border-line bg-surface-2 p-3 text-ink" value={localStatus} onChange={(event) => setLocalStatus(event.target.value as DealStatus)}>{dealStatuses.map((item) => <option key={item}>{item}</option>)}</select>{(localStatus === "Bought" || localStatus === "Sold" || localStatus === "Listed for Resale") && <div className="grid gap-3 sm:grid-cols-3"><Input label="Purchase price" value={purchasePrice} setValue={setPurchasePrice} /><Input label="Pickup cost" value={pickupCost} setValue={setPickupCost} /><Input label="Repair/cleaning" value={repairCost} setValue={setRepairCost} /></div>}{localStatus === "Sold" && <div className="grid gap-3 sm:grid-cols-2"><Input label="Sold price" value={soldPrice} setValue={setSoldPrice} /><Input label="Selling fees" value={sellingFees} setValue={setSellingFees} /><div className="rounded-card border border-profit/30 bg-profit/10 p-3"><p className="text-xs text-muted">Real result</p><p className="mt-1 font-mono text-lg font-bold text-profit">${realProfit} / {roi}% ROI</p><p className="text-xs text-muted">Accuracy uses honest user input for this dev build.</p></div></div>}<textarea className="min-h-[86px] rounded-card border border-line bg-surface-2 p-3 text-ink" placeholder="Notes, seller response, pickup plan, platform sold on, date sold, or sale details" /><button onClick={() => { onStatus(localStatus); onClose(); }} className="h-11 rounded-card bg-brand px-4 text-sm font-bold text-white">Save status</button></div></div></div>; }
function Input({ label, value, setValue }: { label: string; value: number; setValue: (value: number) => void }) { return <label><span className="text-xs text-muted">{label}</span><input className="mt-1 w-full rounded-card border border-line bg-surface-2 p-3 text-ink" type="number" value={value} onChange={(event) => setValue(Number(event.target.value))} /></label>; }
function Metric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) { return <div><p className="text-xs text-muted">{label}</p><p className={`mt-1 font-mono text-base font-bold ${accent ? "text-profit" : "text-ink"}`}>{value}</p></div>; }
function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-[14px] border border-line bg-surface p-3"><p className="text-xs text-muted">{label}</p><p className="mt-1 font-bold text-ink">{value}</p></div>; }
function Break({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) { return <div className="mt-3 flex items-center justify-between border-b border-line pb-2 last:border-b-0"><span className="text-sm text-muted">{label}</span><span className={`font-mono font-bold ${accent ? "text-profit" : "text-ink"}`}>{value}</span></div>; }

