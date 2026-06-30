import { Check } from "./icons";
import { CTAButton } from "./CTAButton";
import type { Plan } from "@/content/pricing";

export function PricingCard({
  plan,
  annual,
}: {
  plan: Plan;
  annual: boolean;
}) {
  const price = annual ? plan.annualMonthly : plan.monthly;
  return (
    <div
      className={`relative flex flex-col rounded-card border bg-surface p-7 shadow-card ${
        plan.highlight ? "border-profit/50 shadow-glow" : "border-line"
      }`}
    >
      {plan.badge && (
        <span className="absolute -top-3 left-7 rounded-full bg-profit px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-white">
          {plan.badge}
        </span>
      )}
      <h3 className="font-display text-xl font-extrabold text-ink">{plan.name}</h3>
      <p className="mt-2 text-sm text-muted">{plan.blurb}</p>

      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="font-mono text-4xl font-bold tnum text-ink">${price}</span>
        <span className="text-sm text-muted">/mo</span>
      </div>
      <p className="mt-1 text-xs text-muted">
        {annual ? `Billed yearly / $${plan.annualTotal}/yr` : "Billed monthly"}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-full bg-surface-2 px-3 py-1 font-mono text-[11px] text-ink">
          {plan.dealChecks}
        </span>
        <span className="rounded-full bg-surface-2 px-3 py-1 font-mono text-[11px] text-ink">
          {plan.watchlists}
        </span>
      </div>

      <CTAButton
        href="/pricing/#download"
        variant={plan.highlight ? "primary" : "ghost"}
        className="mt-6 w-full"
      >
        Start 7-day trial
      </CTAButton>

      <ul className="mt-6 space-y-2.5 border-t border-line pt-6">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-ink/90">
            <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-profit/15 text-profit">
              <Check className="h-3 w-3" />
            </span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

