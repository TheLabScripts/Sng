"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppCard } from "@/components/app/AppCard";
import { crawlerApiClient } from "@/lib/services/crawlerApiClient";
import { mockWatchlists } from "@/lib/mock-data";
import type { CrawlerSavedSearch } from "@/types/snagd";

const storageKey = "snagd-crawler-saved-searches";
const categories = ["Any", "Vehicles", "Motorcycles", "Tools", "Electronics", "Furniture", "Appliances", "Parts", "Sneakers", "Other"];
type Draft = Omit<CrawlerSavedSearch, "id" | "userId" | "lastScannedAt" | "createdAt" | "updatedAt" | "matchCount">;

const emptyDraft: Draft = { name: "Weekend fast flips", zipCode: "08102", radiusMiles: 25, category: "Any", keywords: "clean, working, bundle, moving", negativeKeywords: "broken, parts only, missing", minPrice: 0, maxPrice: 300, minEstimatedProfit: 75, minDealScore: 68, isActive: true, scanIntervalMinutes: 30 };

function localSeed(): CrawlerSavedSearch[] {
  const timestamp = new Date().toISOString();
  return mockWatchlists.map((watchlist) => ({ id: watchlist.id, userId: "local", name: watchlist.name, zipCode: watchlist.location, radiusMiles: watchlist.radius, category: watchlist.category, keywords: watchlist.includeKeywords, negativeKeywords: watchlist.excludeKeywords, minPrice: 0, maxPrice: watchlist.maxBuyPrice, minEstimatedProfit: watchlist.minimumEstimatedProfit, minDealScore: watchlist.minimumSnagdScore, isActive: true, scanIntervalMinutes: watchlist.alertSpeedPreference === "Instant" ? 5 : watchlist.alertSpeedPreference === "Fast" ? 15 : 30, lastScannedAt: null, createdAt: timestamp, updatedAt: timestamp, matchCount: watchlist.producingDeals || 0 }));
}

export function WatchlistsClient() {
  const [searches, setSearches] = useState<CrawlerSavedSearch[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [editingId, setEditingId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState<"connecting" | "live" | "local">("connecting");
  const [notice, setNotice] = useState("");
  const [runningId, setRunningId] = useState("");

  useEffect(() => {
    let active = true;
    crawlerApiClient.listSavedSearches().then((payload) => { if (active) { setSearches(payload.savedSearches); setMode("live"); } }).catch(() => {
      if (!active) return;
      try { const stored = JSON.parse(window.localStorage.getItem(storageKey) || "[]") as CrawlerSavedSearch[]; setSearches(stored.length ? stored : localSeed()); } catch { setSearches(localSeed()); }
      setMode("local");
    });
    return () => { active = false; };
  }, []);

  function saveLocal(next: CrawlerSavedSearch[]) { setSearches(next); window.localStorage.setItem(storageKey, JSON.stringify(next)); }
  function openNew() { setEditingId(""); setDraft(emptyDraft); setShowForm(true); }
  function openEdit(search: CrawlerSavedSearch) { const { id: _id, userId: _userId, lastScannedAt: _last, createdAt: _created, updatedAt: _updated, matchCount: _count, ...nextDraft } = search; setDraft(nextDraft); setEditingId(search.id); setShowForm(true); }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      if (mode === "live") {
        const payload = editingId ? await crawlerApiClient.updateSavedSearch(editingId, draft) : await crawlerApiClient.createSavedSearch(draft);
        setSearches((current) => editingId ? current.map((item) => item.id === editingId ? { ...item, ...payload.savedSearch } : item) : [payload.savedSearch, ...current]);
      } else {
        const timestamp = new Date().toISOString();
        const next: CrawlerSavedSearch = { ...draft, id: editingId || `search-${Date.now()}`, userId: "local", lastScannedAt: null, createdAt: timestamp, updatedAt: timestamp, matchCount: 0 };
        saveLocal(editingId ? searches.map((item) => item.id === editingId ? next : item) : [next, ...searches]);
      }
      setNotice(mode === "live" ? "Saved search is active in the crawler." : "Saved locally. Configure D1 to activate crawling.");
      setShowForm(false); setEditingId(""); setDraft(emptyDraft);
    } catch (error) { setNotice(error instanceof Error ? error.message : "Could not save search."); }
  }

  async function toggleSearch(search: CrawlerSavedSearch) {
    const isActive = !search.isActive;
    try {
      if (mode === "live") await crawlerApiClient.updateSavedSearch(search.id, { isActive });
      const next = searches.map((item) => item.id === search.id ? { ...item, isActive } : item);
      mode === "live" ? setSearches(next) : saveLocal(next);
    } catch (error) { setNotice(error instanceof Error ? error.message : "Could not update search."); }
  }

  async function runNow(search: CrawlerSavedSearch) {
    if (mode !== "live") { setNotice("Connect D1 and enable development auth before running crawlers."); return; }
    setRunningId(search.id); setNotice("");
    try {
      await crawlerApiClient.runSavedSearch(search.id);
      const payload = await crawlerApiClient.listSavedSearches();
      setSearches(payload.savedSearches);
      setNotice(`${search.name} finished scanning.`);
    } catch (error) { setNotice(error instanceof Error ? error.message : "Scan failed."); }
    finally { setRunningId(""); }
  }

  return <div className="dashboard-mobile mx-auto w-full min-w-0 max-w-shell overflow-x-clip">
    <div className="flex items-end justify-between gap-3"><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[.14em] text-brand">Crawler control</p><h1 className="mt-1 text-2xl font-bold text-ink">Saved Searches</h1><p className="mt-1 text-sm text-muted">Automatically scan configured sources by ZIP, radius, price, keywords, profit, and score.</p></div><span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold ${mode === "live" ? "border-profit/35 bg-profit/10 text-profit" : "border-brand/35 bg-brand/10 text-brand"}`}>{mode === "live" ? "LIVE" : mode === "connecting" ? "SYNCING" : "LOCAL"}</span></div>
    <button type="button" onClick={showForm ? () => setShowForm(false) : openNew} className="mt-4 h-11 w-full rounded-card bg-brand px-4 text-sm font-bold text-white">{showForm ? "Close editor" : "Create saved search"}</button>

    {showForm && <AppCard className="mt-4"><form className="grid gap-4" onSubmit={handleSubmit}><h2 className="text-lg font-bold text-ink">{editingId ? "Edit saved search" : "New saved search"}</h2>
      <Field label="Search name"><input className="field" required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></Field>
      <div className="grid grid-cols-2 gap-3"><Field label="ZIP code"><input className="field" required inputMode="numeric" value={draft.zipCode} onChange={(event) => setDraft({ ...draft, zipCode: event.target.value })} /></Field><Field label="Radius miles"><input className="field" type="number" min="1" max="500" value={draft.radiusMiles} onChange={(event) => setDraft({ ...draft, radiusMiles: Number(event.target.value) })} /></Field></div>
      <Field label="Category"><select className="field" value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>{categories.map((category) => <option key={category}>{category}</option>)}</select></Field>
      <div className="grid gap-3 sm:grid-cols-2"><Field label="Keywords"><textarea className="field min-h-20" value={draft.keywords} onChange={(event) => setDraft({ ...draft, keywords: event.target.value })} /></Field><Field label="Negative keywords"><textarea className="field min-h-20" value={draft.negativeKeywords} onChange={(event) => setDraft({ ...draft, negativeKeywords: event.target.value })} /></Field></div>
      <div className="grid grid-cols-2 gap-3"><NumberField label="Min price" value={draft.minPrice} onChange={(value) => setDraft({ ...draft, minPrice: value })} /><NumberField label="Max price" value={draft.maxPrice} onChange={(value) => setDraft({ ...draft, maxPrice: value })} /><NumberField label="Min profit" value={draft.minEstimatedProfit} onChange={(value) => setDraft({ ...draft, minEstimatedProfit: value })} /><NumberField label="Min score" value={draft.minDealScore} onChange={(value) => setDraft({ ...draft, minDealScore: value })} /></div>
      <Field label="Scan interval"><select className="field" value={draft.scanIntervalMinutes} onChange={(event) => setDraft({ ...draft, scanIntervalMinutes: Number(event.target.value) })}>{[5, 15, 30, 60, 180, 360, 1440].map((minutes) => <option key={minutes} value={minutes}>{minutes < 60 ? `${minutes} minutes` : `${minutes / 60} hours`}</option>)}</select></Field>
      <label className="flex min-h-12 items-center justify-between rounded-card border border-line bg-surface-2 px-3 text-sm font-bold text-ink"><span>Active immediately</span><input type="checkbox" checked={draft.isActive} onChange={(event) => setDraft({ ...draft, isActive: event.target.checked })} className="h-5 w-5 accent-[var(--brand)]" /></label>
      <button type="submit" className="h-12 rounded-card bg-brand px-4 text-sm font-bold text-white">Save crawler search</button>
    </form></AppCard>}

    {notice && <p role="status" className="mt-4 rounded-card border border-line bg-surface p-3 text-sm text-muted">{notice}</p>}
    <div className="mt-5 grid gap-4 lg:grid-cols-2">{searches.map((search) => <AppCard key={search.id}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="break-words text-lg font-bold text-ink">{search.name}</h2><p className="mt-1 text-sm text-muted">{search.category} / {search.zipCode} / {search.radiusMiles} mi</p></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${search.isActive ? "bg-profit/12 text-profit" : "bg-surface-2 text-muted"}`}>{search.isActive ? "ACTIVE" : "PAUSED"}</span></div>
      <div className="mt-4 grid grid-cols-2 gap-3"><Metric label="Matches" value={String(search.matchCount || 0)} /><Metric label="Min score" value={String(search.minDealScore)} /><Metric label="Min profit" value={`$${search.minEstimatedProfit}`} /><Metric label="Max price" value={search.maxPrice ? `$${search.maxPrice}` : "Any"} /></div>
      <p className="mt-4 text-xs text-muted">Last scanned: {search.lastScannedAt ? new Date(search.lastScannedAt).toLocaleString() : "Never"}</p><p className="mt-1 text-xs text-muted">Every {search.scanIntervalMinutes} minutes / Excludes: {search.negativeKeywords || "none"}</p>
      <div className="mt-4 grid grid-cols-3 gap-2"><button type="button" onClick={() => void runNow(search)} disabled={runningId === search.id || !search.isActive} className="rounded-card bg-brand px-2 py-3 text-xs font-bold text-white disabled:opacity-45">{runningId === search.id ? "Running..." : "Run now"}</button><button type="button" onClick={() => openEdit(search)} className="rounded-card border border-line bg-surface-2 px-2 py-3 text-xs font-bold text-ink">Edit</button><button type="button" onClick={() => void toggleSearch(search)} className="rounded-card border border-line bg-surface-2 px-2 py-3 text-xs font-bold text-muted">{search.isActive ? "Disable" : "Enable"}</button></div>
    </AppCard>)}</div>
    {!searches.length && mode !== "connecting" && <AppCard className="mt-5"><p className="text-sm text-muted">No saved searches yet. Create one to begin scanning.</p></AppCard>}
    <style jsx>{`.field { width:100%; min-width:0; border-radius:10px; border:1px solid var(--line); background:var(--surface-2); color:var(--ink); padding:.75rem .85rem; outline:none; } .field:focus { border-color:var(--brand); }`}</style>
  </div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid min-w-0 gap-1"><span className="text-xs font-bold text-muted">{label}</span>{children}</label>; }
function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) { return <Field label={label}><input className="field" type="number" min="0" inputMode="numeric" value={value || ""} onChange={(event) => onChange(Number(event.target.value))} /></Field>; }
function Metric({ label, value }: { label: string; value: string }) { return <div className="min-w-0 rounded-card border border-line bg-surface-2 p-3"><p className="text-xs text-muted">{label}</p><p className="mt-1 break-words font-mono text-sm font-bold text-ink">{value}</p></div>; }
