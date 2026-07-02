"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppCard } from "@/components/app/AppCard";
import { DealDetailClient } from "@/components/app/DealDetailClient";
import { crawlerApiClient, crawlerListingToDeal } from "@/lib/services/crawlerApiClient";
import type { Deal } from "@/types/snagd";

export function CrawlerListingDetailClient() {
  const [deal, setDeal] = useState<Deal | null>();
  const [error, setError] = useState("");
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id") || "";
    if (!id) { setDeal(null); setError("Listing ID is missing."); return; }
    crawlerApiClient.getListing(id).then((payload) => setDeal(crawlerListingToDeal(payload.listing))).catch((reason) => { setDeal(null); setError(reason instanceof Error ? reason.message : "Could not load listing."); });
  }, []);
  if (deal === undefined) return <AppCard><div className="h-36 rounded-card shimmer" /><p className="mt-3 text-sm text-muted">Loading crawler listing...</p></AppCard>;
  if (!deal) return <AppCard><h1 className="text-xl font-bold text-ink">Listing unavailable</h1><p className="mt-2 text-sm text-muted">{error}</p><Link href="/app/deal-feed/" className="mt-4 inline-flex rounded-card bg-brand px-4 py-3 text-sm font-bold text-white">Back to feed</Link></AppCard>;
  return <DealDetailClient deal={deal} />;
}
