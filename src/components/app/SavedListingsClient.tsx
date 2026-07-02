"use client";

import { useEffect, useState } from "react";
import { AppCard } from "@/components/app/AppCard";
import { DealCard } from "@/components/app/DealCard";
import { crawlerApiClient, crawlerErrorMessage, crawlerListingToDeal, isRealCrawlerListing } from "@/lib/services/crawlerApiClient";
import type { Deal } from "@/types/snagd";

export function SavedListingsClient() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [message, setMessage] = useState("Loading saved listings...");
  useEffect(() => {
    let active = true;
    crawlerApiClient.listListings().then((payload) => {
      if (!active) return;
      const saved = payload.listings.filter((listing) => isRealCrawlerListing(listing) && ["saved", "contacted", "bought", "sold"].includes(listing.status)).map(crawlerListingToDeal);
      setDeals(saved);
      setMessage(saved.length ? "" : "No real listings have been saved yet. Placeholder deals are disabled.");
    }).catch((error) => { if (active) setMessage(crawlerErrorMessage(error)); });
    return () => { active = false; };
  }, []);
  return <div className="mx-auto min-w-0 max-w-shell"><h1 className="text-2xl font-bold text-ink">Saved Listings</h1><p className="mt-1 text-sm text-muted">Real crawler listings you saved, contacted, bought, or sold.</p>{message && <AppCard className="mt-5"><p className="text-sm text-muted">{message}</p></AppCard>}<div className="mt-5 grid gap-4 lg:grid-cols-2">{deals.map((deal) => <DealCard key={deal.id} deal={deal} />)}</div></div>;
}
