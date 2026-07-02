"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppCard } from "@/components/app/AppCard";
import { DealCard } from "@/components/app/DealCard";
import { LocationPreferenceBar } from "@/components/app/LocationPreferenceBar";
import { crawlerApiClient, crawlerErrorMessage, crawlerListingToDeal, isRealCrawlerListing } from "@/lib/services/crawlerApiClient";
import type { CrawlerAlert, CrawlerSavedSearch, Deal } from "@/types/snagd";

const tools = [
  { label: "Analyze Listing", href: "/app/analyze/", copy: "Paste a listing and price-check it" },
  { label: "Field Scan", href: "/app/field-scan/", copy: "Photo scan a yard-sale find" },
  { label: "VIN Scan", href: "/app/vehicle-mode/", copy: "Decode and value a car" },
  { label: "Create Search", href: "/app/watchlists/", copy: "Track a category near your ZIP" },
  { label: "Saved Deals", href: "/app/saved/", copy: "Review listings you saved" },
  { label: "Price Alerts", href: "/app/alerts/", copy: "Review qualified matches" },
];

export function LiveDashboardClient() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [searches, setSearches] = useState<CrawlerSavedSearch[]>([]);
  const [alerts, setAlerts] = useState<CrawlerAlert[]>([]);
  const [state, setState] = useState<"connecting" | "live" | "empty" | "error">("connecting");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([crawlerApiClient.listListings(true), crawlerApiClient.listSavedSearches(), crawlerApiClient.listAlerts()]).then(([listingPayload, searchPayload, alertPayload]) => {
      if (!active) return;
      const liveDeals = listingPayload.listings.filter(isRealCrawlerListing).map(crawlerListingToDeal);
      setDeals(liveDeals);
      setSearches(searchPayload.savedSearches);
      setAlerts(alertPayload.alerts.filter((alert) => !/mock|demo|seed/i.test(alert.source || "")));
      setState(liveDeals.length ? "live" : "empty");
    }).catch((caught) => { if (active) { setState("error"); setError(crawlerErrorMessage(caught)); } });
    return () => { active = false; };
  }, []);

  const totalProfit = deals.reduce((sum, deal) => sum + Math.max(0, deal.estimatedProfitLow), 0);
  const topDeal = deals[0];
  const recentDeals = deals.filter((deal) => /min|hour|just/i.test(deal.timePosted));

  return <div className="dashboard-mobile mx-auto grid w-full min-w-0 max-w-[430px] gap-5 overflow-x-clip md:max-w-shell">
    <section className="profit-hero motion-card overflow-hidden rounded-[20px] border border-profit/35 p-6 shadow-card"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold text-profit">Live Profit Opportunities</p><p className="mt-2 font-mono text-5xl font-extrabold tracking-tight text-profit">${Math.round(totalProfit).toLocaleString()}</p><p className="mt-2 text-base font-semibold text-ink">from connected real listings</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${state === "live" ? "bg-profit/15 text-profit" : state === "error" ? "bg-pass/15 text-pass" : "bg-brand/15 text-brand"}`}>{state.toUpperCase()}</span></div><div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs"><Mini value={`${deals.length}`} label="matches" /><Mini value={`${recentDeals.length}`} label="recent" /><Mini value={`${searches.filter((search) => search.isActive).length}`} label="searches" /></div></section>
    <LocationPreferenceBar />
    {state !== "live" && <AppCard><h2 className="font-bold text-ink">{state === "error" ? "Live listings disconnected" : state === "connecting" ? "Connecting to live sources" : "No real listings found yet"}</h2><p className="mt-2 text-sm leading-6 text-muted">{state === "error" ? error : state === "empty" ? "The API connected, but no approved live source has produced matches for your saved searches. Placeholder cards are disabled." : "Checking your saved searches and listing sources."}</p><Link href="/app/watchlists/" className="mt-4 inline-flex rounded-card bg-brand px-4 py-3 text-sm font-bold text-white">Manage saved searches</Link></AppCard>}
    {topDeal && <section><div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold text-ink">Best Live Deal</h2><Link href="/app/deal-feed/" className="text-sm font-bold text-brand">Open feed</Link></div><DealCard deal={topDeal} /></section>}
    {deals.length > 1 && <section><div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold text-ink">Latest Matches</h2><span className="text-sm font-bold text-profit">{deals.length} live</span></div><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{deals.slice(1, 5).map((deal) => <DealCard key={deal.id} deal={deal} compact />)}</div></section>}
    <section><div className="mb-3"><h2 className="text-lg font-bold text-ink">Tool Dock</h2><p className="mt-1 text-sm text-muted">Open the workflow you need in the field.</p></div><div className="grid grid-cols-2 gap-3 md:grid-cols-3">{tools.map((tool) => <Link key={tool.label} href={tool.href} className="motion-press rounded-[18px] border border-line bg-surface p-4 shadow-soft hover:border-brand"><p className="font-bold text-ink">{tool.label}</p><p className="mt-2 text-xs leading-5 text-muted">{tool.copy}</p></Link>)}</div></section>
    <section className="grid gap-3 md:grid-cols-2"><AppCard><div className="flex items-center justify-between"><h2 className="text-lg font-bold text-ink">Live Alerts</h2><Link href="/app/alerts/" className="text-sm font-bold text-brand">All</Link></div><p className="mt-3 font-mono text-3xl font-bold text-brand">{alerts.length}</p><p className="mt-1 text-sm text-muted">qualified alerts from real sources</p></AppCard><AppCard><div className="flex items-center justify-between"><h2 className="text-lg font-bold text-ink">Active Searches</h2><Link href="/app/watchlists/" className="text-sm font-bold text-brand">Manage</Link></div><p className="mt-3 font-mono text-3xl font-bold text-brand">{searches.filter((search) => search.isActive).length}</p><p className="mt-1 text-sm text-muted">automatic ZIP-based scans</p></AppCard></section>
  </div>;
}

function Mini({ value, label }: { value: string; label: string }) { return <div className="rounded-[14px] border border-line bg-surface/70 p-3"><p className="font-mono text-lg font-bold text-ink">{value}</p><p className="text-[11px] text-muted">{label}</p></div>; }
