"use client";

import { useEffect, useState } from "react";
import { nichePresets } from "@/lib/mock-data";
import type { OnboardingProfile } from "@/types/snagd";

const automotivePresets = new Set(["Vehicle flipper", "Cars & Vehicles", "Dealer/auction buyer", "Automotive", "Car parts reseller"]);
const categoryOptions = ["Smart Picks", "Everything", "Vehicles", "Furniture", "Tools", "Electronics", "Free", "Sneakers", "Appliances", "Watchlists"];

export function AccountSettingsClient() {
  const [profile, setProfile] = useState<Partial<OnboardingProfile>>({ preset: "Everything profitable", everythingMode: true, automotiveMode: false, defaultFeedCategories: ["Smart Picks", "Everything"] });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("snagd-onboarding-profile");
      if (stored) setProfile(JSON.parse(stored));
    } catch {}
  }, []);

  function update(next: Partial<OnboardingProfile>) {
    const nextProfile = { ...profile, ...next };
    setProfile(nextProfile);
    window.localStorage.setItem("snagd-onboarding-profile", JSON.stringify(nextProfile));
    window.localStorage.setItem("snagd-automotive-mode", nextProfile.automotiveMode ? "true" : "false");
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1400);
  }

  function toggleCategory(category: string) {
    const current = profile.defaultFeedCategories ?? [];
    const nextCategories = current.includes(category) ? current.filter((item) => item !== category) : [...current, category];
    update({ defaultFeedCategories: nextCategories });
  }

  return (
    <div className="grid gap-4 text-sm">
      <label className="grid gap-2">
        <span className="font-bold text-ink">Primary reseller type</span>
        <select className="rounded-card border border-line bg-surface-2 p-3 text-ink" value={profile.preset} onChange={(event) => update({ preset: event.target.value, automotiveMode: automotivePresets.has(event.target.value) })}>
          {nichePresets.map((preset) => <option key={preset}>{preset}</option>)}
        </select>
      </label>
      <div>
        <p className="font-bold text-ink">Default feed categories</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {categoryOptions.map((category) => (
            <button key={category} type="button" onClick={() => toggleCategory(category)} className={`rounded-full border px-3 py-1.5 text-xs font-bold ${profile.defaultFeedCategories?.includes(category) ? "border-brand bg-brand text-white" : "border-line bg-surface-2 text-muted"}`}>
              {category}
            </button>
          ))}
        </div>
      </div>
      <label className="flex items-center justify-between gap-3 rounded-card border border-line bg-surface-2 p-3">
        <span>Everything Mode</span>
        <input type="checkbox" checked={Boolean(profile.everythingMode)} onChange={(event) => update({ everythingMode: event.target.checked })} className="h-5 w-5 accent-[var(--brand)]" />
      </label>
      <label className="flex items-center justify-between gap-3 rounded-card border border-line bg-surface-2 p-3">
        <span>Automotive mode</span>
        <input type="checkbox" checked={Boolean(profile.automotiveMode)} onChange={(event) => update({ automotiveMode: event.target.checked })} className="h-5 w-5 accent-[var(--brand)]" />
      </label>
      <p className={`rounded-card border px-3 py-2 text-xs ${saved ? "border-brand/35 bg-brand/10 text-brand" : "border-line text-muted"}`}>{saved ? "Settings saved locally" : "Changes save on this device"}</p>
    </div>
  );
}
