"use client";

import { useState } from "react";
import { annualPlanCopy, plans } from "@/content/pricing";
import { PricingCard } from "./PricingCard";

export function PricingToggle() {
  const [annual, setAnnual] = useState(true);
  return (
    <div>
      <div className="mb-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <div className="inline-flex rounded-full border border-line bg-surface p-1 shadow-soft">
          <button
            type="button"
            onClick={() => setAnnual(false)}
            className={`h-10 rounded-full px-4 text-sm font-bold transition ${!annual ? "bg-brand text-white shadow-soft" : "text-muted hover:text-ink"}`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setAnnual(true)}
            className={`h-10 rounded-full px-4 text-sm font-bold transition ${annual ? "bg-brand text-white shadow-soft" : "text-muted hover:text-ink"}`}
          >
            Founding Annual
          </button>
        </div>
        {annual && (
          <span className="rounded-full border border-profit/30 bg-profit/10 px-3 py-1 text-xs font-bold text-profit">
            Save up to $549/year
          </span>
        )}
      </div>

      {annual && (
        <div className="mb-6 rounded-[18px] border border-line bg-surface p-4 text-center shadow-soft">
          <p className="text-sm font-bold text-ink">{annualPlanCopy.headline}</p>
          <p className="mt-1 text-xs leading-5 text-muted">{annualPlanCopy.limits}</p>
        </div>
      )}

      <div className="grid items-stretch gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} annual={annual} />
        ))}
      </div>
    </div>
  );
}
