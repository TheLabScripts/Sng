import type { Metadata } from "next";
import Link from "next/link";
import { addOnPacks, goodPaywalls, pricingPlans } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Snagd pricing for reseller deal checks, watchlists, Everything Mode, alerts, and vehicle tools.",
};

export default function PricingPage() {
  return (
    <>
      <section className="border-b border-line bg-bg px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-shell text-center">
          <p className="text-sm font-bold text-profit">Pricing</p>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold text-ink sm:text-5xl">
            Start with the $20/month Founder plan. Upgrade only when usage makes sense.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-muted">
            Snagd charges for more Deal Checks, more watchlists, faster alerts, advanced comps, and high-ticket workflows - not random locked buttons.
          </p>
        </div>
      </section>

      <section className="bg-bg px-4 py-14 sm:px-6">
        <div className="mx-auto grid max-w-shell gap-4 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <article key={plan.id} className={`rounded-card border bg-surface p-5 shadow-card ${plan.highlighted ? "border-brand/55" : "border-line"}`}>
              <p className="text-sm text-muted">{plan.highlighted ? "Most room to grow" : "Plan"}</p>
              <h2 className="mt-2 text-2xl font-bold text-ink">{plan.name}</h2>
              <div className="mt-5 flex items-end gap-1">
                <span className="font-mono text-5xl font-bold text-profit tnum">${plan.price}</span>
                <span className="pb-2 text-sm text-muted">/month</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted">{plan.summary}</p>
              <ul className="mt-5 grid gap-2 text-sm text-muted">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup/" className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-card bg-brand px-4 text-sm font-bold text-bg">
                Get Snagd
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-surface/35 px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-shell">
          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-bold text-profit">Add-ons</p>
              <h2 className="mt-3 text-3xl font-bold text-ink">Buy capacity without changing your whole plan.</h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                Add-on placeholders cover extra Deal Checks, watchlists, SMS, priority alerting, advanced comps, and VIN checks.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {addOnPacks.map((pack) => (
                <div key={pack.name} className="flex items-center justify-between rounded-card border border-line bg-surface p-4">
                  <span className="text-sm text-muted">{pack.name}</span>
                  <span className="font-mono font-bold text-profit tnum">${pack.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-bg px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-shell">
          <p className="text-sm font-bold text-profit">Fair paywalls</p>
          <h2 className="mt-3 text-3xl font-bold text-ink">Good limits are tied to real cost and power usage.</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {goodPaywalls.map((item) => (
              <span key={item} className="rounded-card border border-line bg-surface px-3 py-2 text-sm text-muted">{item}</span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}