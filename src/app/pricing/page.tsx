import type { Metadata } from "next";
import Link from "next/link";
import { addOnPacks, goodPaywalls, pricingPlans } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Snagd pricing for reseller deal checks, watchlists, Everything Mode, alerts, and vehicle tools.",
};

const planDetails = {
  founder: {
    eyebrow: "Start here",
    bestFor: "Part-time flips, one local market, tighter budget control",
    checks: "100",
    watchlists: "5",
    speed: "Standard alerts",
    accent: "border-line",
  },
  pro: {
    eyebrow: "Most useful",
    bestFor: "Active resellers watching more niches and moving faster",
    checks: "500",
    watchlists: "20",
    speed: "Faster alerts",
    accent: "border-brand/60 ring-1 ring-brand/25",
  },
  power: {
    eyebrow: "High volume",
    bestFor: "Teams, high-ticket categories, bulk review, vehicle-heavy work",
    checks: "High",
    watchlists: "Expanded",
    speed: "Priority alerts",
    accent: "border-profit/45",
  },
} as const;

const valueProof = [
  { label: "Founder starts at", value: "$20", sub: "per month" },
  { label: "One avoided bad buy", value: "$40+", sub: "often covers the gap" },
  { label: "One solid flip", value: "$75+", sub: "can cover the month" },
];

export default function PricingPage() {
  return (
    <>
      <section className="border-b border-line bg-bg px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-shell gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="inline-flex rounded-full border border-profit/30 bg-profit/10 px-3 py-1 text-sm font-bold text-profit">Pricing built around profit</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-ink sm:text-6xl">
              Start lean. Upgrade when Snagd is finding more money than your plan can handle.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
              Get Snagd for $20/month. Pay for more Deal Checks, more watchlists, faster alerts, advanced comps, and vehicle tools only when your workflow needs them.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup/" className="inline-flex h-12 items-center justify-center rounded-card bg-brand px-6 text-sm font-bold text-white shadow-card">Get Snagd</Link>
              <Link href="/#how-it-works" className="inline-flex h-12 items-center justify-center rounded-card border border-line bg-surface px-6 text-sm font-bold text-ink">See how it works</Link>
            </div>
          </div>

          <div className="rounded-[22px] border border-line bg-surface p-4 shadow-card sm:p-5">
            <div className="rounded-[18px] border border-profit/30 bg-profit/10 p-5">
              <p className="text-sm font-bold text-profit">Open app. See money. Act fast.</p>
              <p className="mt-3 font-mono text-5xl font-extrabold text-profit">$847</p>
              <p className="mt-2 text-sm text-muted">Mock profit opportunities nearby today</p>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {valueProof.map((item) => (
                <div key={item.label} className="rounded-[16px] border border-line bg-surface-2 p-3">
                  <p className="text-[11px] text-muted">{item.label}</p>
                  <p className="mt-1 font-mono text-xl font-bold text-ink">{item.value}</p>
                  <p className="mt-1 text-[11px] text-muted">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bg px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-shell">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold text-brand">Choose your lane</p>
              <h2 className="mt-2 text-3xl font-extrabold text-ink">Plans that scale with deal volume.</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted">No paywall just to see the dashboard, change settings, or view a basic result.</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {pricingPlans.map((plan) => {
              const detail = planDetails[plan.id];
              return (
                <article key={plan.id} className={`relative overflow-hidden rounded-[22px] border bg-surface p-5 shadow-card ${detail.accent}`}>
                  {plan.highlighted && <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand to-info" />}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">{detail.eyebrow}</p>
                      <h3 className="mt-2 text-2xl font-extrabold text-ink">{plan.name}</h3>
                    </div>
                    {plan.highlighted && <span className="rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">Best fit</span>}
                  </div>

                  <div className="mt-6 flex items-end gap-1">
                    <span className="font-mono text-5xl font-extrabold text-profit tnum">${plan.price}</span>
                    <span className="pb-2 text-sm text-muted">/month</span>
                  </div>
                  <p className="mt-3 min-h-[48px] text-sm leading-6 text-muted">{plan.summary}</p>

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <PlanMetric label="Checks" value={detail.checks} />
                    <PlanMetric label="Watchlists" value={detail.watchlists} />
                    <PlanMetric label="Speed" value={detail.speed} />
                  </div>

                  <p className="mt-5 rounded-card border border-line bg-surface-2 p-3 text-sm text-muted">Best for: <span className="font-bold text-ink">{detail.bestFor}</span></p>

                  <ul className="mt-5 grid gap-2 border-t border-line pt-5 text-sm text-muted">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-profit" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/signup/" className={`mt-6 inline-flex h-12 w-full items-center justify-center rounded-card px-4 text-sm font-bold ${plan.highlighted ? "bg-brand text-white" : "border border-line bg-surface-2 text-ink"}`}>
                    Choose {plan.name}
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface/35 px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-shell gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-bold text-profit">Add-on marketplace</p>
            <h2 className="mt-3 text-3xl font-extrabold text-ink">Buy capacity without changing your whole plan.</h2>
            <p className="mt-3 text-sm leading-6 text-muted">Top off Deal Checks, alert speed, comps, watchlists, or VIN checks only when the month gets busy.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {addOnPacks.map((pack) => (
              <div key={pack.name} className="rounded-[18px] border border-line bg-surface p-4 shadow-soft">
                <p className="text-sm font-bold text-ink">{pack.name}</p>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <span className="text-xs text-muted">Add-on</span>
                  <span className="font-mono text-2xl font-bold text-profit tnum">${pack.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bg px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-shell gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-bold text-brand">Fair paywalls</p>
            <h2 className="mt-3 text-3xl font-extrabold text-ink">Limits should feel fair because they map to real usage.</h2>
            <p className="mt-3 text-sm leading-6 text-muted">Snagd stays useful at the base plan. Heavier workflows pay for the extra checks, speed, and premium data surfaces.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {goodPaywalls.map((item) => (
              <div key={item} className="rounded-card border border-line bg-surface p-3 text-sm font-bold text-ink shadow-soft">{item}</div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function PlanMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-line bg-surface-2 p-3">
      <p className="text-[10px] uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-1 text-sm font-bold text-ink">{value}</p>
    </div>
  );
}
