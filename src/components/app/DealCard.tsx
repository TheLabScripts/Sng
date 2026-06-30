"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Deal, DealStatus, SimilarSale } from "@/types/snagd";
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

  useEffect(() => { setSavedIds(readJson(savedKey, [])); setStatuses(readJson(statusKey, {})); }, []);
  const saved = savedIds.includes(deal.id);
  const status = statuses[deal.id] ?? deal.status ?? "New";

  function pulse(message: string) { setFeedback(message); window.setTimeout(() => setFeedback(""), 1500); }
  function toggleSaved() { const next = saved ? savedIds.filter((id) => id !== deal.id) : [...savedIds, deal.id]; setSavedIds(next); writeJson(savedKey, next); pulse(saved ? "Removed from saved" : "Saved deal"); }
  async function shareDeal() { const text = `Deal found on Snagd: ${deal.itemName} - Estimated profit: ${deal.estimatedProfit}, Snagd Score: ${deal.score}. Get Snagd to find local flips worth chasing.`; if (navigator.share) { await navigator.share({ title: deal.itemName, text, url: deal.listingUrl ?? window.location.href }); pulse("Share opened"); return; } await navigator.clipboard.writeText(text); pulse("Copied share text"); }
  function openListing() { if (deal.listingUrl) window.open(deal.listingUrl, "_blank", "noopener,noreferrer"); else pulse("No source listing URL provided"); }
  function messageSeller() { if (deal.messageUrl) window.open(deal.messageUrl, "_blank", "noopener,noreferrer"); else if (deal.listingUrl) window.open(deal.listingUrl, "_blank", "noopener,noreferrer"); else pulse("This source did not provide a direct message link"); }
  function setStatus(nextStatus: DealStatus) { const next = { ...statuses, [deal.id]: nextStatus }; setStatuses(next); writeJson(statusKey, next); pulse(`Marked ${nextStatus}`); }

  return (
    <article className="motion-card overflow-hidden rounded-[18px] border border-line bg-[#111827]/90 shadow-card">
      <div className="flex gap-3 p-3">
        <Link href={`/app/deal/${deal.id}/`} className={`relative h-28 w-28 shrink-0 overflow-hidden rounded-[14px] border border-line ${thumbnailClass(deal.thumbnailTone)}`} aria-label={`${deal.itemName} detail`}>
          <span className="absolute left-2 top-2 rounded-md bg-brand px-2 py-0.5 text-[10px] font-bold text-bg">NEW</span>
          <span className="absolute bottom-2 right-2 rounded-full bg-black/55 px-2 py-1 text-[10px] text-ink">{deal.distance}</span>
        </Link>
        <div className="min-w-0 flex-1 py-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-xs text-muted">{deal.source} / {deal.timePosted}</p>
              <Link href={`/app/deal/${deal.id}/`} className="mt-1 block text-base font-bold leading-tight text-ink">{deal.itemName}</Link>
              <p className="mt-1 text-xs text-muted">{deal.sellerRating ?? "Seller rating unavailable"}</p>
            </div>
            <button type="button" onClick={toggleSaved} className={`motion-press grid h-9 w-9 place-items-center rounded-full border ${saved ? "border-brand bg-brand text-bg save-pop" : "border-line bg-surface-2 text-muted"}`} aria-label={saved ? "Unsave deal" : "Save deal"}><HeartIcon filled={saved} /></button>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <Metric label="Asking" value={deal.askingLabel} />
            <Metric label="Est. Resale" value={deal.estimatedResale} />
            <Metric label="Est. Profit" value={deal.estimatedProfit} accent />
          </div>
        </div>
      </div>

      <div className="mx-3 rounded-[14px] border border-line bg-[#151b2b] p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-brand/18 text-brand"><SnagdGlyph /></span><div><p className="text-[11px] text-muted">Snagd Score</p><p className="font-mono text-lg font-bold text-brand">{deal.score}</p></div></div>
          <p className="text-sm font-bold text-brand">Under market by {deal.underMarketPercent}%</p>
        </div>
      </div>

      {!compact && <div className="flex flex-wrap gap-2 p-3 pt-2">{deal.reasonTags.slice(0, 3).map((tag) => <span key={tag} className={`rounded-full border px-2.5 py-1 text-[11px] ${tag.toLowerCase().includes("risk") ? "border-pass/25 bg-pass/10 text-pass" : "border-amber/25 bg-amber/10 text-amber"}`}>{tag}</span>)}</div>}

      <div className="grid grid-cols-3 gap-2 border-t border-line p-3">
        <Action onClick={messageSeller}>Message</Action>
        <Action onClick={toggleSaved}>{saved ? "Saved" : "Save"}</Action>
        <Action onClick={shareDeal}>Share</Action>
      </div>
      <div className="grid grid-cols-2 gap-2 px-3 pb-3">
        <Action onClick={() => setSimilarOpen(true)}>Similar Sales</Action>
        <Action onClick={() => setTrackOpen(true)}>Track: {status}</Action>
      </div>
      {feedback && <p className="mx-3 mb-3 rounded-card border border-brand/40 bg-brand/10 px-3 py-2 text-sm text-brand motion-slide">{feedback}</p>}
      {similarOpen && <SimilarSalesModal dealTitle={deal.itemName} sales={deal.similarSales} onClose={() => setSimilarOpen(false)} />}
      {trackOpen && <TrackingModal deal={deal} status={status} onStatus={setStatus} onClose={() => setTrackOpen(false)} />}
    </article>
  );
}

function SimilarSalesModal({ dealTitle, sales, onClose }: { dealTitle: string; sales: SimilarSale[]; onClose: () => void }) { return <div className="fixed inset-0 z-[80] grid place-items-end bg-black/50 p-3 sm:place-items-center" role="dialog" aria-modal="true"><div className="motion-slide max-h-[86vh] w-full max-w-lg overflow-auto rounded-[22px] border border-line bg-surface p-4 shadow-card"><div className="flex items-start justify-between gap-3"><div><p className="text-sm text-muted">Similar Sales</p><h3 className="text-xl font-bold text-ink">{dealTitle}</h3></div><button onClick={onClose} className="rounded-card border border-line px-3 py-2 text-sm text-muted">Close</button></div><div className="mt-4 grid gap-3">{sales.map((sale) => <div key={sale.id} className="rounded-card border border-line bg-surface-2 p-3"><div className="flex gap-3"><div className={`h-14 w-14 rounded-card ${thumbnailClass(sale.thumbnailTone)}`} /><div><p className="font-bold text-ink">{sale.itemTitle}</p><p className="mt-1 text-sm text-muted">${sale.price} / {sale.condition} / {sale.source} / {sale.date}</p><p className="mt-1 text-xs text-muted">{sale.matchConfidence} confidence. {sale.notes}</p></div></div></div>)}</div></div></div>; }
function TrackingModal({ deal, status, onStatus, onClose }: { deal: Deal; status: DealStatus; onStatus: (status: DealStatus) => void; onClose: () => void }) { const [localStatus, setLocalStatus] = useState<DealStatus>(status); const [purchasePrice, setPurchasePrice] = useState(deal.askingPrice); const [soldPrice, setSoldPrice] = useState(deal.estimatedResaleLow); const realProfit = soldPrice - purchasePrice - 18; const roi = purchasePrice > 0 ? Math.round((realProfit / purchasePrice) * 100) : 100; return <div className="fixed inset-0 z-[80] grid place-items-end bg-black/50 p-3 sm:place-items-center"><div className="motion-slide w-full max-w-lg rounded-[22px] border border-line bg-surface p-4 shadow-card"><div className="flex items-start justify-between gap-3"><div><p className="text-sm text-muted">Deal Tracking</p><h3 className="text-xl font-bold text-ink">{deal.itemName}</h3></div><button onClick={onClose} className="rounded-card border border-line px-3 py-2 text-sm text-muted">Close</button></div><p className="mt-3 rounded-card border border-amber/30 bg-amber/10 p-3 text-sm text-amber">This listing looks unavailable. Did you buy it?</p><div className="mt-4 grid gap-3"><select className="rounded-card border border-line bg-surface-2 p-3 text-ink" value={localStatus} onChange={(e) => setLocalStatus(e.target.value as DealStatus)}>{dealStatuses.map((item) => <option key={item}>{item}</option>)}</select>{(localStatus === "Bought" || localStatus === "Sold" || localStatus === "Listed for Resale") && <div className="grid gap-3 sm:grid-cols-2"><Input label="Purchase price" value={purchasePrice} setValue={setPurchasePrice} /><Input label="Pickup/repair estimate" value={18} setValue={() => undefined} /></div>}{localStatus === "Sold" && <div className="grid gap-3 sm:grid-cols-2"><Input label="Sold price" value={soldPrice} setValue={setSoldPrice} /><div><p className="text-xs text-muted">Calculated result</p><p className="mt-1 font-mono text-lg font-bold text-amber">${realProfit} / {roi}% ROI</p><p className="text-xs text-muted">Accuracy vs Snagd estimate uses honest user input for V1.</p></div></div>}<textarea className="min-h-[86px] rounded-card border border-line bg-surface-2 p-3 text-ink" placeholder="Notes, seller response, pickup plan, or sale details" /><button onClick={() => { onStatus(localStatus); onClose(); }} className="h-11 rounded-card bg-brand px-4 text-sm font-bold text-bg">Save status</button></div></div></div>; }
function Input({ label, value, setValue }: { label: string; value: number; setValue: (value: number) => void }) { return <label><span className="text-xs text-muted">{label}</span><input className="mt-1 w-full rounded-card border border-line bg-surface-2 p-3 text-ink" type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} /></label>; }
function Action({ children, onClick }: { children: React.ReactNode; onClick: () => void }) { return <button type="button" onClick={onClick} className="motion-press rounded-[12px] border border-line bg-surface-2 px-3 py-2.5 text-xs font-bold text-ink hover:border-brand hover:text-brand">{children}</button>; }
function Metric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) { return <div><p className="text-[10px] text-muted">{label}</p><p className={`mt-0.5 font-mono text-sm font-bold tnum ${accent ? "text-amber" : "text-ink"}`}>{value}</p></div>; }
function HeartIcon({ filled }: { filled: boolean }) { return <svg viewBox="0 0 24 24" className="h-4 w-4" fill={filled ? "currentColor" : "none"} aria-hidden><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>; }
function SnagdGlyph() { return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden><path d="M7.4 14.8c.8 1.8 2.4 2.8 4.7 2.8 2.1 0 3.5-.8 3.5-2.1 0-1.1-.8-1.7-2.8-2.1l-2-.4C7.8 12.4 6 10.8 6 8.2 6 5 8.7 3 12.4 3c3 0 5.2 1.2 6.3 3.7l-3.1 1.6c-.6-1.4-1.7-2-3.3-2-1.8 0-2.9.7-2.9 1.8 0 1 .7 1.6 2.6 2l2.1.4c3.4.7 5 2.3 5 4.9 0 3.3-2.8 5.2-7.1 5.2-3.6 0-6.2-1.5-7.4-4.2l2.8-1.6Z" /></svg>; }
export function thumbnailClass(tone: string) { if (tone === "amber") return "bg-[radial-gradient(circle_at_30%_25%,rgba(255,158,100,.62),transparent_35%),linear-gradient(145deg,var(--surface-3),var(--surface-2))]"; if (tone === "red") return "bg-[radial-gradient(circle_at_30%_25%,rgba(247,118,142,.58),transparent_35%),linear-gradient(145deg,var(--surface-3),var(--surface-2))]"; if (tone === "blue") return "bg-[radial-gradient(circle_at_30%_25%,rgba(122,162,247,.6),transparent_35%),linear-gradient(145deg,var(--surface-3),var(--surface-2))]"; return "image-card-violet"; }