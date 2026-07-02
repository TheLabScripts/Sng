"use client";

import Link from "next/link";
/* eslint-disable @next/next/no-img-element -- crawler image hosts are dynamic in the static export. */
import { useEffect, useState } from "react";
import { AppCard } from "@/components/app/AppCard";
import { crawlerApiClient, crawlerErrorMessage } from "@/lib/services/crawlerApiClient";
import type { CrawlerAlert } from "@/types/snagd";

export function AlertsClient() {
  const [alerts, setAlerts] = useState<CrawlerAlert[]>([]);
  const [mode, setMode] = useState<"connecting" | "live" | "error">("connecting");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    crawlerApiClient.listAlerts().then((payload) => {
      if (!active) return;
      setAlerts(payload.alerts.filter((alert) => !/mock|demo|seed/i.test(alert.source || "")));
      setMode("live");
    }).catch((error) => { if (active) { setMode("error"); setNotice(crawlerErrorMessage(error)); } });
    return () => { active = false; };
  }, []);

  async function markRead(alert: CrawlerAlert) {
    const status = alert.status === "unread" ? "read" : "unread";
    try { await crawlerApiClient.markAlert(alert.id, status); setAlerts((current) => current.map((item) => item.id === alert.id ? { ...item, status } : item)); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Could not update alert."); }
  }

  async function mute(alert: CrawlerAlert) {
    try { await crawlerApiClient.muteSearchAlerts(alert.saved_search_id); setNotice("Future alerts from this saved search are muted."); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Could not mute alerts."); }
  }

  return <div className="dashboard-mobile mx-auto w-full min-w-0 max-w-shell overflow-x-clip">
    <div className="flex items-end justify-between gap-3"><div><h1 className="text-2xl font-bold text-ink">Alerts</h1><p className="mt-1 text-sm text-muted">Qualified matches from connected live sources.</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${mode === "live" ? "bg-profit/12 text-profit" : mode === "error" ? "bg-pass/12 text-pass" : "bg-brand/12 text-brand"}`}>{mode === "live" ? `${alerts.filter((item) => item.status === "unread").length} UNREAD` : mode === "error" ? "OFFLINE" : "SYNCING"}</span></div>
    {notice && <p role="status" className="mt-4 rounded-card border border-line bg-surface p-3 text-sm text-muted">{notice}</p>}
    <div className="mt-5 grid gap-4">{alerts.map((alert) => <AppCard key={alert.id} className={alert.status === "unread" ? "border-brand/40" : ""}><div className="flex min-w-0 gap-3">{image(alert.image_urls) && <img src={image(alert.image_urls)} alt="" className="h-20 w-20 shrink-0 rounded-card object-cover" />}<div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[.12em] text-brand">{alert.status}</p><h2 className="mt-1 break-words text-lg font-bold text-ink">{alert.title}</h2></div><span className="shrink-0 font-mono text-xl font-bold text-profit">${Math.round(alert.estimated_profit)}</span></div><p className="mt-2 text-sm leading-6 text-muted">{alert.body}</p><p className="mt-2 text-xs text-muted">Score {alert.deal_score} / {new Date(alert.created_at).toLocaleString()}</p></div></div><div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4"><Link href={`/app/listing/?id=${encodeURIComponent(alert.listing_id)}`} className="rounded-card bg-brand px-2 py-3 text-center text-xs font-bold text-white">View listing</Link><button type="button" onClick={() => void markRead(alert)} className="rounded-card border border-line bg-surface-2 px-2 py-3 text-xs font-bold text-ink">{alert.status === "unread" ? "Mark read" : "Unread"}</button><button type="button" onClick={() => void mute(alert)} className="rounded-card border border-line bg-surface-2 px-2 py-3 text-xs font-bold text-muted">Mute search</button></div></AppCard>)}</div>
    {mode === "live" && !alerts.length && <AppCard className="mt-5"><p className="font-bold text-ink">No live alerts yet</p><p className="mt-2 text-sm text-muted">Placeholder alerts are disabled. Alerts appear after a real source match passes your profit and score thresholds.</p></AppCard>}
  </div>;
}

function image(value: string) { try { const parsed = JSON.parse(value) as unknown; return Array.isArray(parsed) ? String(parsed[0] || "") : ""; } catch { return ""; } }
