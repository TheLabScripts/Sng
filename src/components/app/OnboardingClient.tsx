"use client";

import { FormEvent, useState } from "react";
import { SnagdLogo } from "@/components/ui/SnagdLogo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { defaultOnboardingProfile, nichePresets } from "@/lib/mock-data";
import type { OnboardingProfile } from "@/types/snagd";

const automotivePresets = new Set(["Vehicle flipper", "Cars & Vehicles", "Dealer/auction buyer", "Automotive", "Car parts reseller"]);

export function OnboardingClient() {
  const [profile, setProfile] = useState<OnboardingProfile>(defaultOnboardingProfile);

  function finish(nextProfile = profile) {
    const automotiveMode = automotivePresets.has(nextProfile.preset);
    const enrichedProfile = {
      ...nextProfile,
      automotiveMode,
      defaultFeedCategories: automotiveMode ? ["Vehicles", "Tools"] : [nextProfile.preset, "AI Picks"]
    };
    window.localStorage.setItem("snagd-onboarding-profile", JSON.stringify(enrichedProfile));
    window.localStorage.setItem("snagd-automotive-mode", automotiveMode ? "true" : "false");
    window.localStorage.setItem("snagd-session", JSON.stringify({ name: "Demo reseller", email: "demo@snagd.app", plan: "Founder", isAdmin: false }));
    window.location.href = "/app/";
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    finish();
  }

  return (
    <main className="min-h-screen bg-bg px-4 py-5 text-ink">
      <div className="mx-auto flex max-w-shell items-center justify-between">
        <SnagdLogo />
        <ThemeToggle compact />
      </div>

      <div className="mx-auto mt-8 max-w-3xl rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
        <p className="text-sm text-muted">Onboarding</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">Tune Snagd to your hunt</h1>
        <p className="mt-3 text-sm leading-6 text-muted">These settings drive mock watchlists, alerts, Everything Mode, automotive priority, and Deal Check thresholds.</p>

        <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
          <div>
            <span className="text-sm font-bold text-ink">What do you flip?</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {nichePresets.map((preset) => {
                const automotive = automotivePresets.has(preset);
                return (
                  <button key={preset} type="button" onClick={() => setProfile({ ...profile, preset })} className={`rounded-card border px-3 py-2 text-sm ${profile.preset === preset ? "border-brand bg-brand text-white" : "border-line bg-surface-2 text-muted"}`}>
                    {preset}{automotive && <span className="ml-2 text-[10px] opacity-75">auto</span>}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-muted">Automotive presets promote Vehicle Mode and vehicle listings first. You can change this later in settings and watchlists.</p>
          </div>

          <label className="flex items-center justify-between gap-3 rounded-card border border-line bg-surface-2 p-3">
            <span><span className="block text-sm font-bold text-ink">Everything Mode enabled?</span><span className="block text-sm text-muted">Snagd can watch anything profitable based on your thresholds.</span></span>
            <input type="checkbox" checked={profile.everythingMode} onChange={(event) => setProfile({ ...profile, everythingMode: event.target.checked })} className="h-5 w-5 accent-[var(--brand)]" />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="ZIP code or city"><input className="field" value={profile.location} onChange={(event) => setProfile({ ...profile, location: event.target.value })} /></Field>
            <Field label="Alert preference"><select className="field" value={profile.alertPreference} onChange={(event) => setProfile({ ...profile, alertPreference: event.target.value })}>{["Standard in-app", "Fast in-app + email", "Priority in-app + email", "SMS when available"].map((item) => <option key={item}>{item}</option>)}</select></Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <NumberField label="Search radius" value={profile.searchRadius} onChange={(value) => setProfile({ ...profile, searchRadius: value })} />
            <NumberField label="Max pickup distance" value={profile.maxPickupDistance} onChange={(value) => setProfile({ ...profile, maxPickupDistance: value })} />
            <NumberField label="Max buy price" value={profile.maxBuyPrice} onChange={(value) => setProfile({ ...profile, maxBuyPrice: value })} />
            <NumberField label="Minimum profit target" value={profile.minimumProfitTarget} onChange={(value) => setProfile({ ...profile, minimumProfitTarget: value })} />
            <NumberField label="Minimum Snagd Score" value={profile.minimumSnagdScore} onChange={(value) => setProfile({ ...profile, minimumSnagdScore: value })} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2"><button className="h-12 rounded-card bg-brand px-5 text-sm font-bold text-white" type="submit">Finish onboarding</button><button className="h-12 rounded-card border border-line bg-surface-2 px-5 text-sm font-bold text-ink" type="button" onClick={() => finish(defaultOnboardingProfile)}>Use demo settings</button></div>
        </form>
      </div>

      <style jsx>{`.field { width: 100%; border-radius: 8px; border: 1px solid var(--line); background: var(--surface-2); color: var(--ink); padding: 0.75rem 0.85rem; }`}</style>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-2"><span className="text-sm font-bold text-ink">{label}</span>{children}</label>; }
function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) { return <Field label={label}><input className="field" type="number" min="0" value={value} onChange={(event) => onChange(Number(event.target.value))} /></Field>; }
