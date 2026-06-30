"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppCard } from "@/components/app/AppCard";
import { mockWatchlists, nichePresets } from "@/lib/mock-data";
import type { Watchlist } from "@/types/snagd";

const storageKey = "snagd-watchlists";

const emptyDraft: Omit<Watchlist, "id"> = {
  name: "Weekend fast flips",
  nichePreset: "Fast flips only",
  everythingMode: false,
  location: "43215",
  radius: 20,
  maxPickupDistance: 15,
  category: "Any",
  includeKeywords: "clean, working, bundle, moving",
  excludeKeywords: "broken, parts only, missing",
  maxBuyPrice: 250,
  minimumEstimatedProfit: 60,
  minimumSnagdScore: 72,
  conditionPreference: "Good or better",
  alertSpeedPreference: "Fast",
  notificationMethod: "Email + in-app",
};

export function WatchlistsClient() {
  const [watchlists, setWatchlists] = useState<Watchlist[]>(mockWatchlists);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      setWatchlists(JSON.parse(stored) as Watchlist[]);
    }
  }, []);

  function saveWatchlists(nextWatchlists: Watchlist[]) {
    setWatchlists(nextWatchlists);
    window.localStorage.setItem(storageKey, JSON.stringify(nextWatchlists));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveWatchlists([{ ...draft, id: `watch-${Date.now()}` }, ...watchlists]);
    setShowForm(false);
    setDraft(emptyDraft);
  }

  return (
    <div className="mx-auto max-w-shell">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-ink">Watchlists</h2>
          <p className="mt-1 text-sm text-muted">Create source-layer watches by niche, area, budget, profit target, and minimum score.</p>
        </div>
        <button type="button" onClick={() => setShowForm((value) => !value)} className="h-11 rounded-card bg-brand px-4 text-sm font-bold text-white">
          {showForm ? "Close" : "New watchlist"}
        </button>
      </div>

      {showForm && (
        <AppCard className="mt-5">
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Watchlist name">
                <input className="field" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
              </Field>
              <Field label="Niche preset">
                <select className="field" value={draft.nichePreset} onChange={(event) => setDraft({ ...draft, nichePreset: event.target.value })}>
                  {nichePresets.map((preset) => (
                    <option key={preset}>{preset}</option>
                  ))}
                </select>
              </Field>
            </div>

            <label className="flex items-center justify-between gap-3 rounded-card border border-line bg-surface-2 p-3">
              <span>
                <span className="block text-sm font-bold text-ink">Everything Mode</span>
                <span className="block text-sm text-muted">Watch anything profitable instead of one niche.</span>
              </span>
              <input
                type="checkbox"
                checked={draft.everythingMode}
                onChange={(event) => setDraft({ ...draft, everythingMode: event.target.checked })}
                className="h-5 w-5 accent-[var(--brand)]"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="ZIP/city">
                <input className="field" value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} />
              </Field>
              <Field label="Radius">
                <input className="field" type="number" value={draft.radius} onChange={(event) => setDraft({ ...draft, radius: Number(event.target.value) })} />
              </Field>
              <Field label="Max pickup distance">
                <input className="field" type="number" value={draft.maxPickupDistance} onChange={(event) => setDraft({ ...draft, maxPickupDistance: Number(event.target.value) })} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category">
                <input className="field" value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} />
              </Field>
              <Field label="Condition preference">
                <input className="field" value={draft.conditionPreference} onChange={(event) => setDraft({ ...draft, conditionPreference: event.target.value })} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Include keywords">
                <textarea className="field min-h-[86px]" value={draft.includeKeywords} onChange={(event) => setDraft({ ...draft, includeKeywords: event.target.value })} />
              </Field>
              <Field label="Exclude keywords">
                <textarea className="field min-h-[86px]" value={draft.excludeKeywords} onChange={(event) => setDraft({ ...draft, excludeKeywords: event.target.value })} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Max buy price">
                <input className="field" type="number" value={draft.maxBuyPrice} onChange={(event) => setDraft({ ...draft, maxBuyPrice: Number(event.target.value) })} />
              </Field>
              <Field label="Minimum estimated profit">
                <input className="field" type="number" value={draft.minimumEstimatedProfit} onChange={(event) => setDraft({ ...draft, minimumEstimatedProfit: Number(event.target.value) })} />
              </Field>
              <Field label="Minimum Snagd Score">
                <input className="field" type="number" value={draft.minimumSnagdScore} onChange={(event) => setDraft({ ...draft, minimumSnagdScore: Number(event.target.value) })} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Alert speed preference">
                <select className="field" value={draft.alertSpeedPreference} onChange={(event) => setDraft({ ...draft, alertSpeedPreference: event.target.value })}>
                  {["Standard", "Fast", "Instant", "Priority"].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </Field>
              <Field label="Notification method">
                <select className="field" value={draft.notificationMethod} onChange={(event) => setDraft({ ...draft, notificationMethod: event.target.value })}>
                  {["In-app", "Email + in-app", "SMS when available", "Discord when available"].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </Field>
            </div>

            <button className="h-12 rounded-card bg-brand px-5 text-sm font-bold text-white" type="submit">Save watchlist</button>
          </form>
        </AppCard>
      )}

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {watchlists.map((watchlist) => (
          <AppCard key={watchlist.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-ink">{watchlist.name}</h3>
                <p className="mt-1 text-sm text-muted">{watchlist.nichePreset} / {watchlist.location}</p>
              </div>
              <span className={`rounded-card border px-2.5 py-1 text-xs font-bold ${watchlist.everythingMode ? "border-brand/45 bg-brand/15 text-profit" : "border-line text-muted"}`}>
                {watchlist.everythingMode ? "Everything" : "Niche"}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Metric label="Radius" value={`${watchlist.radius} mi`} />
              <Metric label="Pickup max" value={`${watchlist.maxPickupDistance} mi`} />
              <Metric label="Max buy" value={`$${watchlist.maxBuyPrice}`} />
              <Metric label="Min profit" value={`$${watchlist.minimumEstimatedProfit}`} />
              <Metric label="Min score" value={watchlist.minimumSnagdScore.toString()} />
              <Metric label="Alerts" value={watchlist.alertSpeedPreference} />
            </div>
            <p className="mt-4 text-sm text-muted">Include: {watchlist.includeKeywords}</p>
            <p className="mt-2 text-sm text-muted">Exclude: {watchlist.excludeKeywords}</p>
            <p className="mt-3 text-sm text-info">{watchlist.notificationMethod}</p>
          </AppCard>
        ))}
      </div>

      <style jsx>{`
        .field {
          width: 100%;
          border-radius: 8px;
          border: 1px solid var(--line);
          background: var(--surface-2);
          color: var(--ink);
          padding: 0.75rem 0.85rem;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-ink">{label}</span>
      {children}
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-mono text-sm font-bold text-ink tnum">{value}</p>
    </div>
  );
}
