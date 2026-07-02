"use client";

import Link from "next/link";
/* eslint-disable @next/next/no-img-element -- crawler image hosts are dynamic in the static export. */
import { useEffect, useState } from "react";
import { AppCard } from "@/components/app/AppCard";
import { crawlerApiClient } from "@/lib/services/crawlerApiClient";
import { mockAlerts } from "@/lib/mock-data";
import type { CrawlerAlert } from "@/types/snagd";

export function AlertsClient() {
  const [alerts, setAlerts] = useState<CrawlerAlert[]>([]);
  const [mode, setMode] = useState<"connecting" | "live" | "demo">("connecting");
  const [notice, setNotice] = useState("");
  useEffect(() => { let active = true; crawlerApiClient.listAlerts().then((payload) => { if (active) { setAlerts(payload.alerts); setMode("live"); } }).catch(() => { if (active) setMode("demo"); }); return () => { active = false; }; }, []);
  async function markRead(alert: CrawlerAlert) { const status = alert.status === "unread" ? "read" : "unread"; try { await crawlerApiClient.markAlert(alert.id, status); setAlerts((current) => current.map((item) => item.id === alert.id ? { ...item, status } : item)); } catch (error) { setNotice(error instanceof Error ? error.message : "Could not update alert."); } }
  async function mute(alert: CrawlerAlert) { try { await crawlerApiClient.muteSearchAlerts(alert.saved_search_id); setNotice("Future alerts from this saved search are muted."); } catch (error) { setNotice(error instanceof Error ? error.message : "Could not mute alerts."); } }
  return <div className="dashboard-mobile mx-auto w-full min-w-0 max-w-shell overflow-x-clip"><div className="flex items-end justify-between gap-3"><div><h1 className="text-2xl font-bold text-ink">Alerts</h1><p className="mt-1 text-sm text-muted">Qualified crawler matches with the reason each alert fired.</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${mode === "live" ? "bg-profit/12 text-profit" : "bg-brand/12 text-brand"}`}>{mode === "live" ? `${alerts.filter((item) => item.status === "unread").length} UNREAD` : mode === "connecting" ? "SYNCING" : "DEMO"}</span></div>
    {notice && <p role="status" className="mt-4 rounded-card border border-line bg-surface p-3 text-sm text-muted">{notice}</p>}
    <div className="mt-5 grid gap-4">{mode === "live" ? alerts.map((alert) => <AppCard key={alert.id} className={alert.status === "unread" ? "border-brand/40" : ""}><div className="flex min-w-0 gap-3">{image(alert.image_urls) && <img src={image(alert.image_urls)} alt="" className="h-20 w-20 shrink-0 rounded-card object-cover" />}<div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[.12em] text-brand">{alert.status}</p><h2 className="mt-1 break-words text-lg font-bold text-ink">{alert.title}</h2></div><span className="shrink-0 font-mono text-xl font-bold text-profit">${Math.round(alert.estimated_profit)}</span></div><p className="mt-2 text-sm leading-6 text-muted">{alert.body}</p><p className="mt-2 text-xs text-muted">Score {alert.deal_score} / {new Date(alert.created_at).toLocaleString()}</p></div></div><div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4"><Link href={`/app/listing/?id=${encodeURIComponent(alert.listing_id)}`} className="rounded-card bg-brand px-2 py-3 text-center text-xs font-bold text-white">View listing</Link><button type="button" onClick={() => void markRead(alert)} className="rounded-card border border-line bg-surface-2 px-2 py-3 text-xs font-bold text-ink">{alert.status === "unread" ? "Mark read" : "Unread"}</button><button type="button" onClick={() => void mute(alert)} className="rounded-card border border-line bg-surface-2 px-2 py-3 text-xs font-bold text-muted">Mute search</button></div></AppCard>) : mockAlerts.map((alert) => <AppCard key={alert.id}><p className="text-xs font-bold uppercase tracking-[.12em] text-brand">DEMO ALERT</p><h2 className="mt-1 text-lg font-bold text-ink">{alert.item}</h2><p className="mt-2 text-sm text-muted">{alert.why}</p><div className="mt-3 flex justify-between text-sm"><span>Score {alert.score}</span><span className="font-bold text-profit">{alert.profit}</span></div></AppCard>)}</div>
    {mode === "live" && !alerts.length && <AppCard className="mt-5"><p className="text-sm text-muted">No alerts yet. A crawler match must pass both your minimum profit and minimum score.</p></AppCard>}
  </div>;
}

function image(value: string) { try { const parsed = JSON.parse(value) as unknown; return Array.isArray(parsed) ? String(parsed[0] || "") : ""; } catch { return ""; } }
