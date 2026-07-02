"use client";

import { useDeferredValue, useEffect, useState } from "react";
import { DealCard } from "@/components/app/DealCard";
import { defaultListingFilters, type ListingFilters, type PostedWithin } from "@/lib/services/listingFilterService";
import { listingSearchService } from "@/lib/services/listingSearchService";
import { defaultLocationPreference, locationPreferenceService } from "@/lib/services/locationPreferenceService";
import type { Deal } from "@/types/snagd";

const categories = ["Smart Picks", "Everything", "Vehicles", "Furniture", "Tools", "Electronics", "Free", "Sneakers", "Appliances", "Watchlists"];
const postedOptions: PostedWithin[] = ["Any time", "Last hour", "Today", "3 days", "Week"];

export function DealFeedClient({ deals }: { deals: Deal[] }) {
  const [filters, setFilters] = useState<ListingFilters>(defaultListingFilters);
  const [zip, setZip] = useState(defaultLocationPreference.zip);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const deferredFilters = useDeferredValue(filters);

  useEffect(() => {
    const location = locationPreferenceService.load();
    setZip(location.zip);
    setFilters((current) => ({ ...current, radius: location.radius }));
    setSavedIds(JSON.parse(window.localStorage.getItem("snagd-saved-deals") || "[]"));
    if (window.localStorage.getItem("snagd-automotive-mode") === "true") setFilters((current) => ({ ...current, category: "Vehicles" }));
  }, []);

  const filtered = listingSearchService.search(deals, deferredFilters, savedIds);
  const heroDeal = filtered[0];
  const remaining = filtered.slice(1);
  const activeFilters = filterLabels(filters);

  function update<K extends keyof ListingFilters>(key: K, value: ListingFilters[K]) { setFilters((current) => ({ ...current, [key]: value })); }
  function saveLocation() {
    locationPreferenceService.save({ zip: zip.trim() || defaultLocationPreference.zip, radius: filters.radius });
    setNotice(`Browsing ${zip || defaultLocationPreference.zip} within ${filters.radius} miles`);
  }
  function saveConfiguration(kind: "search" | "watchlist") {
    const key = kind === "search" ? "snagd-saved-searches" : "snagd-filter-watchlists";
    const current = JSON.parse(window.localStorage.getItem(key) || "[]") as unknown[];
    window.localStorage.setItem(key, JSON.stringify([...current, { id: Date.now(), zip, filters, createdAt: new Date().toISOString() }]));
    setNotice(kind === "search" ? "Search saved on this device" : "Watchlist created from these filters");
  }
  function clearFilters() { setFilters({ ...defaultListingFilters, radius: filters.radius, category: "Everything" }); setNotice("Filters cleared"); }

  return (
    <div className="mx-auto max-w-[430px] md:max-w-shell">
      <section className="mb-4 rounded-[22px] border border-brand/30 bg-surface p-4 shadow-card">
        <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">Browsing location</p><p className="mt-1 text-sm text-muted">Listings respond to your saved ZIP and pickup radius.</p></div><span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">{filters.radius} mi</span></div>
        <div className="mt-3 grid grid-cols-[1fr_110px] gap-2 sm:grid-cols-[1fr_150px_auto]">
          <input aria-label="ZIP code" inputMode="numeric" maxLength={10} value={zip} onChange={(event) => setZip(event.target.value)} placeholder="ZIP: 08102" className="field" />
          <select aria-label="Radius" value={filters.radius} onChange={(event) => update("radius", Number(event.target.value))} className="field">{[5, 10, 25, 50, 100].map((radius) => <option key={radius} value={radius}>{radius} miles</option>)}</select>
          <button type="button" onClick={saveLocation} className="col-span-2 h-11 rounded-card bg-brand px-4 text-sm font-bold text-white sm:col-span-1">Update Location</button>
        </div>
      </section>

      <div className="mb-4 flex items-end justify-between gap-3"><div><h1 className="text-2xl font-bold text-ink">Deal feed</h1><p className="mt-1 text-sm text-muted">Mock opportunities filtered like a future connected listing feed.</p></div><span className="rounded-full border border-brand/35 bg-brand/10 px-3 py-1 text-xs font-bold text-brand">{filtered.length} matches</span></div>
      <div className="-mx-4 mb-3 overflow-x-auto px-4 no-scrollbar"><div className="flex gap-2">{categories.map((category) => <button key={category} type="button" onClick={() => update("category", category)} className={`motion-press whitespace-nowrap rounded-full border px-3 py-2 text-sm font-bold ${filters.category === category ? "border-brand bg-brand text-white" : "border-line bg-surface text-muted"}`}>{category}</button>)}</div></div>

      <details className="mb-4 rounded-[20px] border border-line bg-surface shadow-soft" open>
        <summary className="cursor-pointer list-none p-4 font-bold text-ink"><div className="flex items-center justify-between"><span>Advanced filters</span><span className="text-xs text-brand">{activeFilters.length} active</span></div></summary>
        <div className="grid gap-4 border-t border-line p-4">
          <div className="grid gap-3 sm:grid-cols-3"><Field label="Keyword"><input className="field" value={filters.keyword} onChange={(e) => update("keyword", e.target.value)} placeholder="Camry, tools..." /></Field><Field label="Include keywords"><input className="field" value={filters.includeKeywords} onChange={(e) => update("includeKeywords", e.target.value)} placeholder="clean title" /></Field><Field label="Exclude keywords"><input className="field" value={filters.excludeKeywords} onChange={(e) => update("excludeKeywords", e.target.value)} placeholder="broken, parts" /></Field></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><NumberField label="Price min" value={filters.priceMin} onChange={(v) => update("priceMin", v)} /><NumberField label="Price max" value={filters.priceMax} onChange={(v) => update("priceMax", v)} /><NumberField label="Min score" value={filters.minimumScore} onChange={(v) => update("minimumScore", v)} /><NumberField label="Min profit" value={filters.minimumProfit} onChange={(v) => update("minimumProfit", v)} /></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><NumberField label="Under market %" value={filters.minimumUnderMarket} onChange={(v) => update("minimumUnderMarket", v)} /><SelectField label="Posted within" value={filters.postedWithin} options={postedOptions} onChange={(v) => update("postedWithin", v as PostedWithin)} /><SelectField label="Condition" value={filters.condition} options={["Any", "Like new", "Very Good", "Good", "Fair", "Damaged", "Runs and drives"]} onChange={(v) => update("condition", v)} /><SelectField label="Seller rating" value={filters.sellerRating} options={["Any", "4.9", "4.8", "4.7", "New seller"]} onChange={(v) => update("sellerRating", v)} /></div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4"><Toggle label="Saved only" checked={filters.savedOnly} onChange={(v) => update("savedOnly", v)} /><Toggle label="Price drops" checked={filters.priceDropsOnly} onChange={(v) => update("priceDropsOnly", v)} /><Toggle label="Free items" checked={filters.freeOnly} onChange={(v) => update("freeOnly", v)} /><SelectField label="Source" value={filters.source} options={["Any", ...Array.from(new Set(deals.map((deal) => deal.source)))]} onChange={(v) => update("source", v)} /></div>

          <details className="rounded-card border border-line bg-surface-2"><summary className="cursor-pointer p-3 text-sm font-bold text-ink">Vehicle filters</summary><div className="grid gap-3 border-t border-line p-3"><div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><NumberField label="Year min" value={filters.yearMin} onChange={(v) => update("yearMin", v)} /><NumberField label="Year max" value={filters.yearMax} onChange={(v) => update("yearMax", v)} /><Field label="Make"><input className="field" value={filters.make} onChange={(e) => update("make", e.target.value)} /></Field><Field label="Model"><input className="field" value={filters.model} onChange={(e) => update("model", e.target.value)} /></Field><NumberField label="Mileage max" value={filters.mileageMax} onChange={(v) => update("mileageMax", v)} /><NumberField label="Vehicle price max" value={filters.vehiclePriceMax} onChange={(v) => update("vehiclePriceMax", v)} /><NumberField label="Vehicle profit min" value={filters.vehicleProfitMin} onChange={(v) => update("vehicleProfitMin", v)} /><SelectField label="Title/history risk" value={filters.titleRisk} options={["Any", "Low", "Medium", "High"]} onChange={(v) => update("titleRisk", v as ListingFilters["titleRisk"])} /></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-3"><Toggle label="Clean title" checked={filters.cleanTitleOnly} onChange={(v) => update("cleanTitleOnly", v)} /><Toggle label="VIN checked" checked={filters.vinCheckedOnly} onChange={(v) => update("vinCheckedOnly", v)} /><Toggle label="Auction/history signals" checked={filters.auctionSignalsOnly} onChange={(v) => update("auctionSignalsOnly", v)} /></div></div></details>

          <div className="grid grid-cols-3 gap-2"><button type="button" onClick={() => saveConfiguration("search")} className="rounded-card border border-brand/35 bg-brand/10 px-2 py-3 text-xs font-bold text-brand">Save this search</button><button type="button" onClick={() => saveConfiguration("watchlist")} className="rounded-card bg-brand px-2 py-3 text-xs font-bold text-white">Create Watchlist</button><button type="button" onClick={clearFilters} className="rounded-card border border-line px-2 py-3 text-xs font-bold text-muted">Clear filters</button></div>
          {notice && <p className="rounded-card border border-profit/30 bg-profit/10 p-2 text-center text-xs font-bold text-profit" role="status">{notice}</p>}
        </div>
      </details>

      {activeFilters.length > 0 && <div className="mb-4 flex flex-wrap gap-2">{activeFilters.map((label) => <span key={label} className="rounded-full border border-brand/25 bg-brand/10 px-2.5 py-1 text-xs font-bold text-brand">{label}</span>)}</div>}
      {heroDeal && <div className="mb-4"><DealCard deal={heroDeal} /></div>}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">{remaining.map((deal) => <DealCard key={deal.id} deal={deal} compact />)}</div>
      {!filtered.length && <div className="rounded-[18px] border border-line bg-surface p-5 text-sm text-muted">No mock listings match this combination. Clear a filter or expand the radius.</div>}
      <style jsx>{`.field { width: 100%; min-width: 0; border-radius: 10px; border: 1px solid var(--line); background: var(--surface-2); color: var(--ink); padding: .7rem .75rem; outline: none; } .field:focus { border-color: var(--brand); }`}</style>
    </div>
  );
}

function filterLabels(filters: ListingFilters) {
  const labels = [filters.category !== "Everything" ? filters.category : "", filters.keyword && `“${filters.keyword}”`, filters.priceMin ? `$${filters.priceMin}+` : "", filters.priceMax ? `Under $${filters.priceMax}` : "", filters.minimumScore ? `Score ${filters.minimumScore}+` : "", filters.minimumProfit ? `Profit $${filters.minimumProfit}+` : "", filters.minimumUnderMarket ? `${filters.minimumUnderMarket}% under` : "", filters.postedWithin !== "Any time" ? filters.postedWithin : "", filters.savedOnly ? "Saved" : "", filters.priceDropsOnly ? "Price drops" : "", filters.freeOnly ? "Free" : "", filters.cleanTitleOnly ? "Clean title" : "", filters.vinCheckedOnly ? "VIN checked" : ""];
  return labels.filter(Boolean) as string[];
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-1"><span className="text-[11px] font-bold text-muted">{label}</span>{children}</label>; }
function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) { return <Field label={label}><input className="field" type="number" min="0" inputMode="numeric" value={value || ""} onChange={(e) => onChange(Number(e.target.value))} /></Field>; }
function SelectField({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) { return <Field label={label}><select className="field" value={value} onChange={(e) => onChange(e.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></Field>; }
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) { return <label className="flex min-h-11 items-center justify-between gap-2 rounded-card border border-line bg-surface-2 px-3 text-xs font-bold text-ink"><span>{label}</span><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-[var(--brand)]" /></label>; }
