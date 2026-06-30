"use client";

import { useState } from "react";
import { plans } from "@/content/pricing";
import { PricingCard } from "./PricingCard";

export function PricingToggle() {
  const [annual, setAnnual] = useState(true);
  return (
    <div>
      <div className="mb-10 flex items-center justify-center gap-3">
        <span className={`text-sm ${!annual ? "text-ink" : "text-muted"}`}>Monthly</span>
        <button
          role="switch"
          aria-checked={annual}
          aria-label="Toggle annual billing"
          onClick={() => setAnnual((a) => !a)}
          className={`relative h-7 w-12 rounded-full border transition-colors ${
            annual ? "border-profit/50 bg-profit/20" : "border-line bg-surface-2"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-profit transition-transform ${
              annual ? "translate-x-6" : "translate-x-0.5"
            }`}
          />
        </button>
        <span className={`flex items-center gap-2 text-sm ${annual ? "text-ink" : "text-muted"}`}>
          Annual
          <span className="rounded-full bg-profit/15 px-2 py-0.5 font-mono text-[10px] font-bold text-profit">
            SAVE 30%+
          </span>
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((p) => (
          <PricingCard key={p.id} plan={p} annual={annual} />
        ))}
      </div>
    </div>
  );
}

