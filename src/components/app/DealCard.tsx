"use client";

import Link from "next/link";
/* eslint-disable @next/next/no-img-element -- crawler image hosts are dynamic in the static export. */
import { useEffect, useState } from "react";
import type { Deal, DealStatus } from "@/types/snagd";
import { readJson, writeJson } from "@/lib/storage/snagdStorage";
import { crawlerApiClient } from "@/lib/services/crawlerApiClient";

const savedKey = "snagd-saved-deal-ids";
const statusKey = "snagd-deal-statuses";

export function DealCard({ deal, compact = false }: { deal: Deal; compact?: boolean }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<Record<string, DealStatus>>({});
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setSavedIds(readJson(savedKey, []));
    setStatuses(readJson(statusKey, {}));
  }, []);

  const saved = savedIds.includes(deal.id);
  const status = statuses[deal.id] ?? deal.status ?? "New";
  const detailHref = deal.dataOrigin === "crawler" ? `/app/listing/?id=${encodeURIComponent(deal.crawlerListingId || deal.id)}` : `/app/deal/${deal.id}/`;

  function pulse(message: string) {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 1500);
  }

  function toggleSaved() {
    const next = saved ? savedIds.filter((id) => id !== deal.id) : [...savedIds, deal.id];
    setSavedIds(next);
    writeJson(savedKey, next);
    window.dispatchEvent(new CustomEvent("snagd:saved-deals-changed"));
    if (deal.dataOrigin === "crawler") void crawlerApiClient.updateListingStatus(deal.crawlerListingId || deal.id, saved ? "new" : "saved").catch(() => undefined);
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
    if (deal.dataOrigin === "crawler") void crawlerApiClient.updateListingStatus(deal.crawlerListingId || deal.id, "contacted").catch(() => undefined);
    if (deal.messageUrl) window.open(deal.messageUrl, "_blank", "noopener,noreferrer");
    else if (deal.listingUrl) window.open(deal.listingUrl, "_blank", "noopener,noreferrer");
    else pulse("This source did not provide a direct message link");
  }

  if (compact) {
    return (
      <article className="motion-card overflow-hidden rounded-[18px] border border-line bg-surface shadow-card">
        <Link href={detailHref} className={`relative block aspect-[1.12] overflow-hidden border-b border-line ${thumbnailClass(deal.thumbnailTone)}`} aria-label={`${deal.itemName} detail`}>
          {deal.imageUrls?.[0] && <img src={deal.imageUrls[0]} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />}
          <span className="absolute left-2 top-2 rounded-md bg-brand px-2 py-0.5 text-[10px] font-bold text-white">{deal.recommendation === "BUY" ? "STEAL" : deal.recommendation}</span>
          <button type="button" onClick={(event) => { event.preventDefault(); toggleSaved(); }} className={`absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full border shadow-soft ${saved ? "save-pop border-pass/55 bg-surface/95 text-pass" : "border-white/35 bg-black/35 text-white"}`} aria-label={saved ? "Unsave deal" : "Save deal"}>
            <HeartIcon filled={saved} />
          </button>
        </Link>
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <p className="font-mono text-lg font-extrabold text-ink">{deal.askingLabel}</p>
            <p className="font-mono text-sm font-bold text-profit">{deal.estimatedProfit}</p>
          </div>
          <p className="mt-1 text-[11px] text-muted">Est. value {deal.estimatedResale}</p>
          <Link href={detailHref} className="mt-2 line-clamp-2 block min-h-[36px] text-sm font-bold leading-tight text-ink">{deal.itemName}</Link>
          <p className="mt-1 truncate text-[11px] text-muted">{deal.condition} / {deal.distance} away</p>
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="rounded-full bg-brand/12 px-2 py-1 text-[11px] font-bold text-brand">Score {deal.score}</span>
            <span className="text-[11px] font-bold text-profit">-{deal.underMarketPercent}%</span>
          </div>
          <p className="mt-2 text-[10px] text-muted">Based on {deal.similarSalesCount} similar sales / {deal.demand} demand</p>
        </div>
      </article>
    );
  }

  return (
    <article className="motion-card overflow-hidden rounded-[18px] border border-line bg-surface shadow-card">
      <div className="flex gap-3 p-3">
        <Link href={detailHref} className={`relative h-28 w-28 shrink-0 overflow-hidden rounded-[14px] border border-line ${thumbnailClass(deal.thumbnailTone)}`} aria-label={`${deal.itemName} detail`}>
          {deal.imageUrls?.[0] && <img src={deal.imageUrls[0]} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />}
          <span className="absolute left-2 top-2 rounded-md bg-brand px-2 py-0.5 text-[10px] font-bold text-white">NEW</span>
          <span className="absolute bottom-2 right-2 rounded-full bg-black/55 px-2 py-1 text-[10px] text-white">{deal.distance}</span>
        </Link>
        <div className="min-w-0 flex-1 py-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-xs text-muted">{deal.source} / {deal.timePosted}</p>
              <Link href={detailHref} className="mt-1 block text-base font-bold leading-tight text-ink">{deal.itemName}</Link>
              <p className="mt-1 text-xs text-muted">{deal.sellerRating ?? "Seller rating unavailable"}</p>
            </div>
            <button type="button" onClick={toggleSaved} className={`motion-press grid h-9 w-9 shrink-0 place-items-center rounded-full border ${saved ? "save-pop border-pass/55 bg-surface text-pass" : "border-line bg-surface-2 text-muted"}`} aria-label={saved ? "Unsave deal" : "Save deal"}>
              <HeartIcon filled={saved} />
            </button>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <Metric label="Asking" value={deal.askingLabel} />
            <Metric label="Est. Resale" value={deal.estimatedResale} />
            <Metric label="Est. Profit" value={deal.estimatedProfit} accent />
          </div>
        </div>
      </div>

      <div className="mx-3 rounded-[14px] border border-line bg-surface-2 p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand/18 text-brand"><SnagdGlyph /></span>
            <div>
              <p className="text-[11px] text-muted">Snagd Score</p>
              <p className="font-mono text-lg font-bold text-brand">{deal.score}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-profit">Under market by {deal.underMarketPercent}%</p>
            <p className="text-[11px] text-muted">{deal.similarSalesCount} sales / {deal.demand} demand / {deal.competition} comp.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 p-3 pt-2">
        {deal.reasonTags.slice(0, 3).map((tag) => <span key={tag} className={`rounded-full border px-2.5 py-1 text-[11px] ${tagClass(tag)}`}>{tag}</span>)}
      </div>

      <div className="grid grid-cols-4 gap-2 border-t border-line p-3">
        <Action onClick={messageSeller}>Message</Action>
        <Action onClick={openListing}>Open</Action>
        <Action onClick={toggleSaved}>{saved ? "Saved" : "Save"}</Action>
        <Action onClick={shareDeal}>Share</Action>
      </div>
      <div className="grid grid-cols-2 gap-2 px-3 pb-3">
        <Link href={`${detailHref}#similar-sales`} className="motion-press rounded-[12px] border border-line bg-surface-2 px-3 py-2.5 text-center text-xs font-bold text-ink">Similar Sales</Link>
        <Link href={`${detailHref}#track-outcome`} className="motion-press rounded-[12px] border border-line bg-surface-2 px-3 py-2.5 text-center text-xs font-bold text-ink">Track: {status}</Link>
      </div>
      {deal.dataOrigin === "crawler" && <button type="button" onClick={() => { void crawlerApiClient.updateListingStatus(deal.crawlerListingId || deal.id, "ignored").then(() => pulse("Listing ignored")).catch(() => pulse("Could not update listing")); }} className="mx-3 mb-3 w-[calc(100%_-_1.5rem)] rounded-[12px] border border-line bg-surface-2 px-3 py-2.5 text-xs font-bold text-muted">Ignore listing</button>}
      {feedback && <p className="mx-3 mb-3 rounded-card border border-brand/40 bg-brand/10 px-3 py-2 text-sm text-brand motion-slide">{feedback}</p>}
    </article>
  );
}

function tagClass(tag: string) {
  const lower = tag.toLowerCase();
  if (lower.includes("risk") || lower.includes("repair") || lower.includes("unknown")) return "border-pass/25 bg-pass/10 text-pass";
  if (tag.includes("%") || lower.includes("profit")) return "border-profit/25 bg-profit/10 text-profit";
  if (lower.includes("listed") || lower.includes("fast")) return "border-amber/25 bg-amber/10 text-amber";
  return "border-brand/25 bg-brand/10 text-brand";
}

function Action({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="motion-press rounded-[12px] border border-line bg-surface-2 px-3 py-2.5 text-xs font-bold text-ink hover:border-brand hover:text-brand">{children}</button>;
}

function Metric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return <div><p className="text-[10px] text-muted">{label}</p><p className={`mt-0.5 font-mono text-sm font-bold tnum ${accent ? "text-profit" : "text-ink"}`}>{value}</p></div>;
}

function HeartIcon({ filled }: { filled: boolean }) {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill={filled ? "currentColor" : "none"} aria-hidden><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>;
}

function SnagdGlyph() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden><path d="M7.4 14.8c.8 1.8 2.4 2.8 4.7 2.8 2.1 0 3.5-.8 3.5-2.1 0-1.1-.8-1.7-2.8-2.1l-2-.4C7.8 12.4 6 10.8 6 8.2 6 5 8.7 3 12.4 3c3 0 5.2 1.2 6.3 3.7l-3.1 1.6c-.6-1.4-1.7-2-3.3-2-1.8 0-2.9.7-2.9 1.8 0 1 .7 1.6 2.6 2l2.1.4c3.4.7 5 2.3 5 4.9 0 3.3-2.8 5.2-7.1 5.2-3.6 0-6.2-1.5-7.4-4.2l2.8-1.6Z" /></svg>;
}

export function thumbnailClass(tone: string) {
  if (tone === "amber") return "bg-[radial-gradient(circle_at_30%_25%,rgba(255,158,100,.62),transparent_35%),linear-gradient(145deg,var(--surface-3),var(--surface-2))]";
  if (tone === "red") return "bg-[radial-gradient(circle_at_30%_25%,rgba(247,118,142,.58),transparent_35%),linear-gradient(145deg,var(--surface-3),var(--surface-2))]";
  if (tone === "blue") return "bg-[radial-gradient(circle_at_30%_25%,rgba(37,99,235,.36),transparent_35%),linear-gradient(145deg,var(--surface-3),var(--surface-2))]";
  return "image-card-blue";
}
