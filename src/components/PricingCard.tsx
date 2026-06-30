import { Check } from "./icons";
import { CTAButton } from "./CTAButton";
import type { Plan } from "@/content/pricing";

export function PricingCard({ plan, annual }: { plan: Plan; annual: boolean }) {
  return (
    <div className={`relative flex h-full flex-col rounded-card border bg-surface p-6 shadow-card ${plan.highlight ? "border-brand/55 ring-1 ring-brand/20" : "border-line"}`}>
      {plan.badge && (
        <span className="absolute -top-3 left-6 rounded-full bg-brand px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
          {plan.badge}
        </span>
      )}

      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-extrabold text-ink">{plan.name}</h3>
          <p className="mt-2 min-h-[44px] text-sm leading-6 text-muted">{plan.blurb}</p>
        </div>
      </div>

      <div className="mt-6">
        {annual ? (
          <>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">{plan.annualLabel}</p>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="font-mono text-5xl font-bold tnum text-profit">${plan.annualTotal}</span>
              <span className="text-sm text-muted">/year</span>
            </div>
            <p className="mt-2 text-sm font-bold text-profit">Save ${plan.annualSavings}/year</p>
            <p className="mt-1 text-xs leading-5 text-muted">Same monthly usage limits, renewed each month.</p>
          </>
        ) : (
          <>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Monthly</p>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="font-mono text-5xl font-bold tnum text-profit">${plan.monthly}</span>
              <span className="text-sm text-muted">/month</span>
            </div>
            <p className="mt-2 text-sm font-bold text-brand">7-day free trial</p>
            <p className="mt-1 text-xs leading-5 text-muted">Cancel before billing if it is not finding useful opportunities.</p>
          </>
        )}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
        <PlanPill label="Checks" value={plan.dealChecks} />
        <PlanPill label="Watchlists" value={plan.watchlists} />
        <PlanPill label="Tools" value={plan.vinChecks} />
      </div>

      <ul className="mt-6 grid gap-2.5 border-t border-line pt-6">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm leading-5 text-ink/90">
            <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand/12 text-brand">
              <Check className="h-3 w-3" />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <CTAButton href="/signup/" variant={plan.highlight ? "primary" : "ghost"} className="w-full rounded-card">
          Start 7-day trial
        </CTAButton>
      </div>
    </div>
  );
}

function PlanPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-line bg-surface-2 p-3">
      <p className="text-[10px] uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-1 text-xs font-bold leading-4 text-ink">{value}</p>
    </div>
  );
}
