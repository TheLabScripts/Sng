import Link from "next/link";
import { AppCard } from "@/components/app/AppCard";
import { UsageMeter } from "@/components/app/UsageMeter";
import { addOnPacks, goodPaywalls, mockUsage, pricingPlans } from "@/lib/mock-data";

export default function BillingPage() {
  return (
    <div className="mx-auto max-w-shell">
      <div>
        <h2 className="text-2xl font-bold text-ink">Billing and usage</h2>
        <p className="mt-1 text-sm text-muted">Deal Checks are the usage credit. Basic app access stays useful without noisy locks.</p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <AppCard>
          <h3 className="text-lg font-bold text-ink">Current usage</h3>
          <div className="mt-4 grid gap-4">
            <UsageMeter label="Deal Checks" used={mockUsage.dealChecksUsed} limit={mockUsage.dealChecksLimit} />
            <UsageMeter label="Watchlists" used={mockUsage.watchlistsUsed} limit={mockUsage.watchlistsLimit} />
          </div>
          <p className="mt-4 text-sm text-muted">Plan: {mockUsage.plan}. Cycle ends {mockUsage.billingCycleEnds}.</p>
        </AppCard>

        <AppCard>
          <h3 className="text-lg font-bold text-ink">Paywall philosophy</h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            Snagd should charge for heavier usage and faster workflows, not basic trust. No paying just to see the dashboard, view a basic result, change settings, or dodge random locked buttons.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {goodPaywalls.map((item) => (
              <span key={item} className="rounded-card border border-line bg-surface-2 px-2.5 py-1 text-xs text-muted">
                {item}
              </span>
            ))}
          </div>
        </AppCard>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {pricingPlans.map((plan) => (
          <AppCard key={plan.id} className={plan.highlighted ? "border-profit/50" : ""}>
            <div className="flex min-h-full flex-col">
              <div>
                <p className="text-sm text-muted">{plan.highlighted ? "Most flexible" : "Plan"}</p>
                <h3 className="mt-1 text-2xl font-bold text-ink">{plan.name}</h3>
                <div className="mt-4 flex items-end gap-1">
                  <span className="font-mono text-4xl font-bold text-profit tnum">${plan.price}</span>
                  <span className="pb-1 text-sm text-muted">/month</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">{plan.summary}</p>
              </div>
              <ul className="mt-5 grid gap-2 text-sm text-muted">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-profit" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup/" className="mt-6 inline-flex h-11 items-center justify-center rounded-card bg-profit px-4 text-sm font-bold text-bg">
                Choose {plan.name}
              </Link>
            </div>
          </AppCard>
        ))}
      </div>

      <AppCard className="mt-5">
        <h3 className="text-lg font-bold text-ink">Add-on placeholders</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {addOnPacks.map((pack) => (
            <div key={pack.name} className="flex items-center justify-between gap-3 border-b border-line pb-3">
              <span className="text-sm text-muted">{pack.name}</span>
              <span className="font-mono font-bold text-profit tnum">${pack.price}</span>
            </div>
          ))}
        </div>
      </AppCard>
    </div>
  );
}