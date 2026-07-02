import Link from "next/link";
import { AppCard } from "@/components/app/AppCard";
import { UsageMeter } from "@/components/app/UsageMeter";
import { addOnPacks, annualPlanCopy, goodPaywalls, mockUsage, pricingPlans } from "@/lib/mock-data";
import { stripeBillingPlaceholder, stripeIntegrationTodos } from "@/lib/services/stripeBilling";

export default function BillingPage() {
  const remainingChecks = mockUsage.dealChecksLimit - mockUsage.dealChecksUsed;
  const remainingVin = (mockUsage.vinChecksLimit ?? 0) - (mockUsage.vinChecksUsed ?? 0);

  return (
    <div className="mx-auto max-w-shell">
      <div>
        <h2 className="text-2xl font-bold text-ink">Billing and usage</h2>
        <p className="mt-1 text-sm text-muted">Track monthly limits, trials, add-ons, and Founding Annual savings from one place.</p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <AppCard>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-ink">Current usage</h3>
              <p className="mt-1 text-sm text-muted">Plan: {mockUsage.plan}. Cycle ends {mockUsage.billingCycleEnds}.</p>
            </div>
            <div className="rounded-card border border-brand/30 bg-brand/10 px-3 py-2 text-right">
              <p className="font-mono text-xl font-bold text-brand">{remainingChecks}</p>
              <p className="text-[11px] text-muted">checks left</p>
            </div>
          </div>
          <div className="mt-4 grid gap-4">
            <UsageMeter label="Deal Checks" used={mockUsage.dealChecksUsed} limit={mockUsage.dealChecksLimit} />
            <UsageMeter label="Watchlists" used={mockUsage.watchlistsUsed} limit={mockUsage.watchlistsLimit} />
            <UsageMeter label="VIN Checks" used={mockUsage.vinChecksUsed ?? 0} limit={mockUsage.vinChecksLimit ?? 5} />
          </div>
          <p className="mt-4 text-sm text-muted">VIN checks remaining: <span className="font-mono font-bold text-brand">{remainingVin}</span></p>
        </AppCard>

        <AppCard>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-ink">Founding Annual</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{annualPlanCopy.headline} Annual billing is paid upfront, but usage limits still renew monthly.</p>
            </div>
            <Link href="/pricing/" className="inline-flex h-11 items-center justify-center rounded-card bg-brand px-4 text-sm font-bold text-white">Compare plans</Link>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div key={plan.id} className="rounded-card border border-line bg-surface-2 p-3">
                <p className="text-xs font-bold text-brand">{plan.name}</p>
                <p className="mt-2 font-mono text-2xl font-bold text-profit">${plan.annualPrice}</p>
                <p className="text-[11px] text-muted">Save ${plan.annualSavings}/year</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-muted">{annualPlanCopy.note}</p>
        </AppCard>
      </div>

      <AppCard className="mt-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm font-bold text-brand">Billing connection placeholder</p><h3 className="mt-1 text-lg font-bold text-ink">Subscription record</h3><p className="mt-1 text-sm text-muted">No payment keys or customer secrets are stored in this frontend.</p></div><span className="rounded-full border border-amber/30 bg-amber/10 px-3 py-1 text-xs font-bold text-amber">Customer portal TODO</span></div>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4"><BillingField label="Customer ID" value={stripeBillingPlaceholder.stripeCustomerId || "Not connected"} /><BillingField label="Subscription ID" value={stripeBillingPlaceholder.subscriptionId || "Not connected"} /><BillingField label="Price ID" value={stripeBillingPlaceholder.priceId || "Environment TODO"} /><BillingField label="Billing interval" value={stripeBillingPlaceholder.billingInterval} /><BillingField label="Plan status" value={stripeBillingPlaceholder.planStatus} /><BillingField label="Renewal date" value={stripeBillingPlaceholder.renewalDate || "Webhook TODO"} /></div>
        <div className="mt-4 flex flex-wrap gap-2">{stripeIntegrationTodos.map((item) => <span key={item} className="rounded-card border border-line bg-surface-2 px-2.5 py-1 text-xs text-muted">{item}</span>)}</div>
      </AppCard>

      <div className="mt-5 grid items-stretch gap-4 lg:grid-cols-3">
        {pricingPlans.map((plan) => (
          <AppCard key={plan.id} className={plan.highlighted ? "border-brand/50 ring-1 ring-brand/15" : ""}>
            <div className="flex h-full flex-col">
              <div>
                <p className="text-sm font-bold text-brand">{plan.badge ?? "Plan"}</p>
                <h3 className="mt-1 text-2xl font-bold text-ink">{plan.name}</h3>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <PriceBlock label="Monthly" value={`$${plan.monthlyPrice}`} sub="/month" />
                  <PriceBlock label={plan.annualLabel} value={`$${plan.annualPrice}`} sub="/year" savings={`Save $${plan.annualSavings}`} />
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">{plan.summary}</p>
              </div>
              <ul className="mt-5 grid gap-2 text-sm text-muted">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup/" className="mt-auto inline-flex h-11 items-center justify-center rounded-card bg-brand px-4 pt-0 text-sm font-bold text-white">
                Start 7-day trial
              </Link>
            </div>
          </AppCard>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <AppCard>
          <h3 className="text-lg font-bold text-ink">Add-ons</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {addOnPacks.map((pack) => (
              <div key={pack.name} className="rounded-card border border-line bg-surface-2 p-3">
                <p className="min-h-[36px] text-sm font-bold text-ink">{pack.name}</p>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <span className="text-[11px] capitalize text-muted">{pack.cadence}</span>
                  <span className="font-mono font-bold text-profit tnum">${pack.price}</span>
                </div>
              </div>
            ))}
          </div>
        </AppCard>

        <AppCard>
          <h3 className="text-lg font-bold text-ink">Fair paywalls</h3>
          <p className="mt-2 text-sm leading-6 text-muted">Snagd charges for heavier workflow capacity, not basic trust or account access.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {goodPaywalls.map((item) => (
              <span key={item} className="rounded-card border border-line bg-surface-2 px-2.5 py-1 text-xs text-muted">
                {item}
              </span>
            ))}
          </div>
        </AppCard>
      </div>
    </div>
  );
}

function BillingField({ label, value }: { label: string; value: string }) { return <div className="rounded-card border border-line bg-surface-2 p-3"><p className="text-[11px] text-muted">{label}</p><p className="mt-1 break-all text-sm font-bold text-ink">{value}</p></div>; }

function PriceBlock({ label, value, sub, savings }: { label: string; value: string; sub: string; savings?: string }) {
  return (
    <div className="rounded-card border border-line bg-surface-2 p-3">
      <p className="text-[10px] uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-1 font-mono text-xl font-bold text-profit">{value}<span className="text-xs text-muted">{sub}</span></p>
      {savings && <p className="mt-1 text-[11px] font-bold text-profit">{savings}</p>}
    </div>
  );
}

