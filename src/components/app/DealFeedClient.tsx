"use client";

import { useEffect, useMemo, useState } from "react";
import { DealCard } from "@/components/app/DealCard";
import type { Deal } from "@/types/snagd";

const chips = ["AI Picks", "Everything", "Vehicles", "Furniture", "Tools", "Electronics", "Free", "Sneakers", "Appliances", "Watchlists"];

export function DealFeedClient({ deals }: { deals: Deal[] }) {
  const [active, setActive] = useState("AI Picks");

  useEffect(() => {
    if (window.localStorage.getItem("snagd-automotive-mode") === "true") setActive("Vehicles");
  }, []);

  const filtered = useMemo(() => {
    if (active === "AI Picks") return deals.filter((deal) => deal.score >= 76 || deal.recommendation === "BUY");
    if (active === "Everything") return deals;
    if (active === "Free") return deals.filter((deal) => deal.askingPrice === 0 || deal.category.toLowerCase().includes("free"));
    if (active === "Watchlists") return deals.filter((deal) => deal.score >= 80 || deal.distanceMiles <= 7);
    return deals.filter((deal) => deal.category.toLowerCase().includes(active.toLowerCase().replace(/s$/, "")));
  }, [active, deals]);

  const heroDeal = filtered[0] ?? deals[0];
  const remaining = filtered.slice(1);

  return (
    <div className="mx-auto max-w-[430px] md:max-w-shell">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-ink">Live deal feed</h1><p className="mt-1 text-sm text-muted">Photo-first flips sorted by margin, score, distance, and timing. Automotive profiles open on vehicles first.</p></div>
        <span className="rounded-full border border-brand/35 bg-brand/10 px-3 py-1 text-xs font-bold text-brand">{filtered.length} live</span>
      </div>
      <div className="-mx-4 mb-2 overflow-x-auto px-4 no-scrollbar">
        <div className="flex gap-2">{chips.map((chip) => <button key={chip} type="button" onClick={() => setActive(chip)} className={`motion-press whitespace-nowrap rounded-full border px-3 py-2 text-sm font-bold ${active === chip ? "border-brand bg-brand text-white" : "border-line bg-surface text-muted"}`}>{chip}</button>)}</div>
      </div>
      <p className="mb-4 text-xs text-muted">Swipe chips to filter by niche. No hidden bottom navigation.</p>
      {heroDeal && <div className="mb-4"><DealCard deal={heroDeal} /></div>}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">{remaining.map((deal) => <DealCard key={deal.id} deal={deal} compact />)}</div>
      {!filtered.length && <div className="rounded-[18px] border border-line bg-surface p-5 text-sm text-muted">No mock deals match this chip yet. Try Everything or AI Picks.</div>}
    </div>
  );
}
