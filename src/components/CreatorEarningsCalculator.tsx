"use client";

import { useMemo, useState } from "react";
import { creatorCommission, pricingPlans } from "@/lib/mock-data";
import { currency } from "@/lib/format";

export function CreatorEarningsCalculator() {
  const [subscribers, setSubscribers] = useState(80);
  const [planId, setPlanId] = useState("pro");
  const selectedPlan = pricingPlans.find((plan) => plan.id === planId) ?? pricingPlans[1];
  const commissionRate = creatorCommission.rate / 100;
  const monthlyCommission = useMemo(() => Math.round(subscribers * selectedPlan.monthlyPrice * commissionRate), [subscribers, selectedPlan.monthlyPrice, commissionRate]);
  const annualized = monthlyCommission * 12;

  return (
    <div className="rounded-[24px] border border-line bg-surface p-5 shadow-card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-bold text-brand">Creator earnings calculator</p>
          <h2 className="mt-2 text-2xl font-extrabold text-ink">Show the upside before they apply.</h2>
        </div>
        <div className="rounded-card border border-profit/30 bg-profit/10 px-4 py-3 text-right">
          <p className="font-mono text-2xl font-bold text-profit">{currency(monthlyCommission)}</p>
          <p className="text-xs text-muted">estimated monthly</p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-bold text-ink">Active referred subscribers</span>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={subscribers}
              onChange={(event) => setSubscribers(Number(event.target.value))}
              className="accent-[var(--brand)]"
            />
            <span className="font-mono text-sm font-bold text-brand">{subscribers.toLocaleString()} active subscribers</span>
          </label>

          <div>
            <p className="text-sm font-bold text-ink">Average plan</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {pricingPlans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setPlanId(plan.id)}
                  className={`h-11 rounded-card border px-3 text-sm font-bold ${plan.id === planId ? "border-brand bg-brand text-white" : "border-line bg-surface-2 text-ink"}`}
                >
                  {plan.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Result label="Commission" value={`${creatorCommission.rate}%`} />
          <Result label="Plan ARPU" value={`$${selectedPlan.monthlyPrice}`} />
          <Result label="Annualized" value={currency(annualized)} />
        </div>
      </div>
    </div>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-line bg-surface-2 p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-2 font-mono text-xl font-bold text-profit">{value}</p>
    </div>
  );
}
