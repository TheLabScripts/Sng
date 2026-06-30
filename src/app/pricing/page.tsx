import type { Metadata } from "next";
import Link from "next/link";
import { PricingToggle } from "@/components/PricingToggle";
import { addOnPacks, annualPlanCopy, creatorCommission, goodPaywalls } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Snagd pricing for reseller deal checks, watchlists, alerts, annual plans, add-ons, and vehicle tools.",
};

const proofStats = [
  { label: "Starter monthly", value: "$20", sub: "7-day free trial" },
  { label: "Starter annual", value: "$99", sub: "Save $141/year" },
  { label: "Creator commission", value: "30%", sub: "recurring" },
];

export default function PricingPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-bg px-4 py-12 sm:px-6 sm:py-16">
        <div className="pointer-events-none absolute inset-0 soft-grid opacity-60" />
        <div className="pointer-events-none absolute right-[-12rem] top-10 hidden h-80 w-80 rounded-full bg-brand/10 blur-3xl lg:block" />
        <div className="relative mx-auto grid max-w-shell gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-end">
          <div>
            <p className="inline-flex rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-sm font-bold text-brand">Pricing that funds the hunt</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-ink sm:text-6xl">
              Start monthly. Go annual when you want the biggest discount.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
              Every plan includes a 7-day free trial. Founding Annual pricing is heavily discounted for early users, while the monthly Deal Check and watchlist limits stay simple and predictable.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup/" className="inline-flex h-12 items-center justify-center rounded-card bg-brand px-6 text-sm font-bold text-white shadow-card">Start free trial</Link>
              <Link href="/app/billing/" className="inline-flex h-12 items-center justify-center rounded-card border border-line bg-surface px-6 text-sm font-bold text-ink">View billing demo</Link>
            </div>
          </div>

          <div className="rounded-[22px] border border-line bg-surface p-4 shadow-card sm:p-5">
            <div className="rounded-[18px] border border-profit/30 bg-profit/10 p-5">
              <p className="text-sm font-bold text-brand">{annualPlanCopy.headline}</p>
              <p className="mt-3 font-mono text-5xl font-extrabold text-profit">$549</p>
              <p className="mt-2 text-sm text-muted">Maximum annual savings on Power</p>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {proofStats.map((item) => (
                <div key={item.label} className="rounded-[16px] border border-line bg-surface-2 p-3">
                  <p className="text-[11px] text-muted">{item.label}</p>
                  <p className="mt-1 font-mono text-xl font-bold text-profit">{item.value}</p>
                  <p className="mt-1 text-[11px] text-muted">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bg px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-shell">
          <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold text-brand">Simple plans</p>
              <h2 className="mt-2 text-3xl font-extrabold text-ink">Choose how much deal flow you need.</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted">Annual plans are paid upfront and keep the same monthly usage limits, renewed each month.</p>
          </div>
          <PricingToggle />
          <p className="mt-5 rounded-[18px] border border-line bg-surface p-4 text-sm leading-6 text-muted shadow-soft">
            {annualPlanCopy.note}
          </p>
        </div>
      </section>

      <section className="border-y border-line bg-surface/45 px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-shell gap-6 lg:grid-cols-[0.76fr_1.24fr]">
          <div>
            <p className="text-sm font-bold text-brand">Add-ons</p>
            <h2 className="mt-3 text-3xl font-extrabold text-ink">Top off the month without jumping plans.</h2>
            <p className="mt-3 text-sm leading-6 text-muted">Buy extra capacity when a busy week shows up. Monthly add-ons stay clearly labeled.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {addOnPacks.map((pack) => (
              <div key={pack.name} className="rounded-[18px] border border-line bg-surface p-4 shadow-soft">
                <p className="min-h-[40px] text-sm font-bold text-ink">{pack.name}</p>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <span className="text-xs capitalize text-muted">{pack.cadence}</span>
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
            <p className="text-sm font-bold text-brand">Fair limits</p>
            <h2 className="mt-3 text-3xl font-extrabold text-ink">Paywalls should match real workload.</h2>
            <p className="mt-3 text-sm leading-6 text-muted">The core app stays useful. Heavy users pay for more checks, more alerts, better research depth, and vehicle intelligence.</p>
            <div className="mt-5 rounded-[18px] border border-profit/30 bg-profit/10 p-4">
              <p className="font-bold text-profit">{creatorCommission.rate}% recurring creator commission</p>
              <p className="mt-2 text-sm leading-6 text-muted">Creators earn while referred subscribers stay active.</p>
            </div>
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

