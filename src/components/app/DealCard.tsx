"use client";

import { useEffect, useState } from "react";
import type { Deal, DealStatus, SimilarSale } from "@/types/snagd";
import { RecommendationBadge, RiskBadge, ScoreBadge } from "@/components/app/Badges";
import { readJson, writeJson } from "@/lib/storage/snagdStorage";

const savedKey = "snagd-saved-deal-ids";
const statusKey = "snagd-deal-statuses";
const dealStatuses: DealStatus[] = ["New", "Saved", "Messaged Seller", "Planning Pickup", "Bought", "Passed", "Lost / Sold to Someone Else", "Listed for Resale", "Sold"];

export function DealCard({ deal, compact = false }: { deal: Deal; compact?: boolean }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<Record<string, DealStatus>>({});
  const [similarOpen, setSimilarOpen] = useState(false);
  const [trackOpen, setTrackOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setSavedIds(readJson(savedKey, []));
    setStatuses(readJson(statusKey, {}));
  }, []);

  const saved = savedIds.includes(deal.id);
  const status = statuses[deal.id] ?? deal.status ?? "New";

  function toggleSaved() {
    const next = saved ? savedIds.filter((id) => id !== deal.id) : [...savedIds, deal.id];
    setSavedIds(next);
    writeJson(savedKey, next);
    pulse(saved ? "Removed from saved" : "Saved deal");
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

  function openListing() {
    if (deal.listingUrl) window.open(deal.listingUrl, "_blank", "noopener,noreferrer");
    else pulse("No source listing URL provided");
  }

  function messageSeller() {
    if (deal.messageUrl) window.open(deal.messageUrl, "_blank", "noopener,noreferrer");
    else if (deal.listingUrl) window.open(deal.listingUrl, "_blank", "noopener,noreferrer");
    else pulse("This source did not provide a direct message link");
  }

  function setStatus(nextStatus: DealStatus) {
    const next = { ...statuses, [deal.id]: nextStatus };
    setStatuses(next);
    writeJson(statusKey, next);
    pulse(`Marked ${nextStatus}`);
  }

  function pulse(message: string) {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 1500);
  }

  return (
    <article className="motion-card rounded-card border border-line bg-surface p-4 shadow-card">
      <div className="flex gap-3">
        <div className={`h-24 w-24 shrink-0 rounded-card border border-line bg-surface-2 ${thumbnailClass(deal.thumbnailTone)}`} aria-label="Listing thumbnail placeholder" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-xs text-muted">{deal.source} / {deal.timePosted} / {deal.distance}</p>
              <h3 className="mt-1 text-lg font-bold text-ink">{deal.itemName}</h3>
              <p className="mt-1 text-xs text-muted">{deal.sellerRating ?? "Seller rating unavailable"}</p>
            </div>
            <button type="button" onClick={toggleSaved} className={`motion-press grid h-10 w-10 place-items-center rounded-full border ${saved ? "border-brand bg-brand text-bg save-pop" : "border-line bg-surface-2 text-muted"}`} aria-label={saved ? "Unsave deal" : "Save deal"}>
              <HeartIcon filled={saved} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[auto_1fr] gap-4 rounded-card border border-line bg-surface-2 p-3">
        <ScoreDial score={deal.score} />
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <RecommendationBadge value={deal.recommendation} />
            <RiskBadge value={deal.risk} />
            <span className="rounded-card border border-line px-2.5 py-1 text-xs text-muted">{status}</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted">{deal.reason}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <Metric label="Ask" value={deal.askingLabel} />
        <Metric label="Resale" value={deal.estimatedResale} />
        <Metric label="Profit" value={deal.estimatedProfit} accent />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted sm:grid-cols-3">
        <Support label="Similar sales" value={`${deal.similarSalesCount}`} />
        <Support label="Under market" value={`${deal.underMarketPercent}%`} accent />
        <Support label="Demand" value={deal.demand} />
        <Support label="Competition" value={deal.competition} />
        <Support label="Confidence" value={deal.confidence} />
        <Support label="Listed" value={deal.timePosted} />
      </div>

      {!compact && (
        <div className="mt-4 flex flex-wrap gap-2">
          {deal.reasonTags.map((tag) => <span key={tag} className="rounded-card border border-line bg-surface-2 px-2.5 py-1 text-xs text-muted">{tag}</span>)}
        </div>
      )}
      {deal.note && <p className="mt-3 text-sm text-amber">{deal.note}</p>}

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        <Action onClick={() => setSimilarOpen(true)}>Similar Sales</Action>
        <Action onClick={messageSeller}>Message Seller</Action>
        <Action onClick={openListing}>Open Listing</Action>
        <Action onClick={shareDeal}>Share</Action>
        <Action onClick={() => setTrackOpen(true)}>Track</Action>
      </div>

      {feedback && <p className="mt-3 rounded-card border border-brand/40 bg-brand/10 px-3 py-2 text-sm text-brand motion-slide">{feedback}</p>}
      {similarOpen && <SimilarSalesModal dealTitle={deal.itemName} sales={deal.similarSales} onClose={() => setSimilarOpen(false)} />}
      {trackOpen && <TrackingModal deal={deal} status={status} onStatus={setStatus} onClose={() => setTrackOpen(false)} />}
    </article>
  );
}

function ScoreDial({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative grid h-16 w-16 place-items-center">
      <svg viewBox="0 0 48 48" className="h-16 w-16 -rotate-90" aria-hidden>
        <circle cx="24" cy="24" r="18" stroke="var(--surface-3)" strokeWidth="5" fill="none" />
        <circle className="score-meter" cx="24" cy="24" r="18" stroke="var(--brand)" strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <div className="absolute text-center"><ScoreBadge score={score} /><p className="text-[10px] text-muted">Score</p></div>
    </div>
  );
}

function SimilarSalesModal({ dealTitle, sales, onClose }: { dealTitle: string; sales: SimilarSale[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] grid place-items-end bg-black/45 p-3 sm:place-items-center" role="dialog" aria-modal="true">
      <div className="motion-slide max-h-[86vh] w-full max-w-lg overflow-auto rounded-card border border-line bg-surface p-4 shadow-card">
        <div className="flex items-start justify-between gap-3"><div><p className="text-sm text-muted">Similar Sales</p><h3 className="text-xl font-bold text-ink">{dealTitle}</h3></div><button onClick={onClose} className="rounded-card border border-line px-3 py-2 text-sm text-muted">Close</button></div>
        <div className="mt-4 grid gap-3">
          {sales.map((sale) => <div key={sale.id} className="rounded-card border border-line bg-surface-2 p-3"><div className="flex gap-3"><div className={`h-14 w-14 rounded-card ${thumbnailClass(sale.thumbnailTone)}`} /><div><p className="font-bold text-ink">{sale.itemTitle}</p><p className="mt-1 text-sm text-muted">${sale.price} / {sale.condition} / {sale.source} / {sale.date}</p><p className="mt-1 text-xs text-muted">{sale.matchConfidence} confidence. {sale.notes}</p></div></div></div>)}
        </div>
      </div>
    </div>
  );
}

function TrackingModal({ deal, status, onStatus, onClose }: { deal: Deal; status: DealStatus; onStatus: (status: DealStatus) => void; onClose: () => void }) {
  const [localStatus, setLocalStatus] = useState<DealStatus>(status);
  const [purchasePrice, setPurchasePrice] = useState(deal.askingPrice);
  const [soldPrice, setSoldPrice] = useState(deal.estimatedResaleLow);
  const realProfit = soldPrice - purchasePrice - 18;
  const roi = purchasePrice > 0 ? Math.round((realProfit / purchasePrice) * 100) : 100;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-end bg-black/45 p-3 sm:place-items-center" role="dialog" aria-modal="true">
      <div className="motion-slide w-full max-w-lg rounded-card border border-line bg-surface p-4 shadow-card">
        <div className="flex items-start justify-between gap-3"><div><p className="text-sm text-muted">Deal Tracking</p><h3 className="text-xl font-bold text-ink">{deal.itemName}</h3></div><button onClick={onClose} className="rounded-card border border-line px-3 py-2 text-sm text-muted">Close</button></div>
        <p className="mt-3 rounded-card border border-amber/30 bg-amber/10 p-3 text-sm text-amber">This listing looks unavailable. Did you buy it?</p>
        <div className="mt-4 grid gap-3">
          <select className="rounded-card border border-line bg-surface-2 p-3 text-ink" value={localStatus} onChange={(e) => setLocalStatus(e.target.value as DealStatus)}>{dealStatuses.map((item) => <option key={item}>{item}</option>)}</select>
          {(localStatus === "Bought" || localStatus === "Sold" || localStatus === "Listed for Resale") && <div className="grid gap-3 sm:grid-cols-2"><Input label="Purchase price" value={purchasePrice} setValue={setPurchasePrice} /><Input label="Pickup/repair estimate" value={18} setValue={() => undefined} /></div>}
          {localStatus === "Sold" && <div className="grid gap-3 sm:grid-cols-2"><Input label="Sold price" value={soldPrice} setValue={setSoldPrice} /><div><p className="text-xs text-muted">Calculated result</p><p className="mt-1 font-mono text-lg font-bold text-amber">${realProfit} / {roi}% ROI</p><p className="text-xs text-muted">Accuracy vs Snagd estimate uses honest user input for V1.</p></div></div>}
          <textarea className="min-h-[86px] rounded-card border border-line bg-surface-2 p-3 text-ink" placeholder="Notes, seller response, pickup plan, or sale details" />
          <button onClick={() => { onStatus(localStatus); onClose(); }} className="h-11 rounded-card bg-brand px-4 text-sm font-bold text-bg">Save status</button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, setValue }: { label: string; value: number; setValue: (value: number) => void }) { return <label><span className="text-xs text-muted">{label}</span><input className="mt-1 w-full rounded-card border border-line bg-surface-2 p-3 text-ink" type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} /></label>; }
function Action({ children, onClick }: { children: React.ReactNode; onClick: () => void }) { return <button type="button" onClick={onClick} className="motion-press rounded-card border border-line bg-surface-2 px-3 py-2 text-xs font-bold text-ink hover:border-brand hover:text-brand">{children}</button>; }
function Metric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) { return <div><p className="text-xs text-muted">{label}</p><p className={`mt-1 font-mono font-bold tnum ${accent ? "text-amber" : "text-ink"}`}>{value}</p></div>; }
function Support({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) { return <div className="rounded-card border border-line bg-surface-2 p-2"><p>{label}</p><p className={`mt-1 font-bold ${accent ? "text-amber" : "text-ink"}`}>{value}</p></div>; }
function HeartIcon({ filled }: { filled: boolean }) { return <svg viewBox="0 0 24 24" className="h-4 w-4" fill={filled ? "currentColor" : "none"} aria-hidden><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>; }
function thumbnailClass(tone: string) { if (tone === "amber") return "bg-[radial-gradient(circle_at_30%_25%,rgba(255,158,100,.62),transparent_35%),linear-gradient(145deg,var(--surface-3),var(--surface-2))]"; if (tone === "red") return "bg-[radial-gradient(circle_at_30%_25%,rgba(247,118,142,.58),transparent_35%),linear-gradient(145deg,var(--surface-3),var(--surface-2))]"; if (tone === "blue") return "bg-[radial-gradient(circle_at_30%_25%,rgba(122,162,247,.6),transparent_35%),linear-gradient(145deg,var(--surface-3),var(--surface-2))]"; return "bg-[radial-gradient(circle_at_30%_25%,rgba(187,154,247,.62),transparent_35%),linear-gradient(145deg,var(--surface-3),var(--surface-2))]"; }