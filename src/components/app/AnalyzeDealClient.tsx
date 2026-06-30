"use client";

import { FormEvent, useState } from "react";
import { AppCard } from "@/components/app/AppCard";
import { RecommendationBadge, RiskBadge } from "@/components/app/Badges";
import { currency } from "@/lib/format";
import { aiScoringService } from "@/lib/services/aiScoringService";
import type { DealAnalysisInput, DealAnalysisResult } from "@/types/snagd";

const initialInput: DealAnalysisInput = {
  title: "Milwaukee tool bundle",
  askingPrice: 140,
  category: "Tools",
  condition: "Good",
  location: "43215",
  description: "Drill, impact driver, charger, and two batteries. Seller says everything works and wants it gone today.",
  listingUrl: "",
  estimatedPickupDistance: 12,
  notes: "Ask for battery health and model numbers.",
};

export function AnalyzeDealClient() {
  const [input, setInput] = useState<DealAnalysisInput>(initialInput);
  const [screenshotName, setScreenshotName] = useState("");
  const [result, setResult] = useState<DealAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextResult = await aiScoringService.scoreDeal(input);
    setResult(nextResult);
  }

  function updateField<K extends keyof DealAnalysisInput>(key: K, value: DealAnalysisInput[K]) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="mx-auto grid max-w-shell gap-4 lg:grid-cols-[1fr_0.9fr]">
      <AppCard>
        <h2 className="text-2xl font-bold text-ink">Analyze a deal</h2>
        <p className="mt-1 text-sm text-muted">Run a deterministic mock score using price, category, condition, risk, and distance.</p>

        <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
          <Field label="Listing title">
            <input className="field" value={input.title} onChange={(event) => updateField("title", event.target.value)} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Asking price">
              <input
                className="field"
                type="number"
                min="0"
                value={input.askingPrice}
                onChange={(event) => updateField("askingPrice", Number(event.target.value))}
              />
            </Field>
            <Field label="Estimated pickup distance">
              <input
                className="field"
                type="number"
                min="0"
                value={input.estimatedPickupDistance}
                onChange={(event) => updateField("estimatedPickupDistance", Number(event.target.value))}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <select className="field" value={input.category} onChange={(event) => updateField("category", event.target.value)}>
                {["Furniture", "Tools", "Electronics", "Appliances", "Sneakers/clothing", "Video games", "Car parts", "Vehicle", "Other"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>
            <Field label="Condition">
              <select className="field" value={input.condition} onChange={(event) => updateField("condition", event.target.value)}>
                {["Like new", "Good", "Fair", "Damaged", "Untested", "Runs and drives"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Location / ZIP">
            <input className="field" value={input.location} onChange={(event) => updateField("location", event.target.value)} />
          </Field>

          <Field label="Description">
            <textarea
              className="field min-h-[120px] resize-y"
              value={input.description}
              onChange={(event) => updateField("description", event.target.value)}
            />
          </Field>

          <Field label="Optional listing URL">
            <input
              className="field"
              placeholder="https://example.com/listing"
              value={input.listingUrl}
              onChange={(event) => updateField("listingUrl", event.target.value)}
            />
          </Field>

          <Field label="Optional screenshot upload placeholder">
            <input
              className="field file:mr-3 file:rounded-card file:border-0 file:bg-surface-3 file:px-3 file:py-2 file:text-ink"
              type="file"
              accept="image/*"
              onChange={(event) => setScreenshotName(event.target.files?.[0]?.name ?? "")}
            />
            {screenshotName && <p className="mt-2 text-xs text-muted">Attached locally for demo: {screenshotName}</p>}
          </Field>

          <Field label="Notes">
            <textarea
              className="field min-h-[82px] resize-y"
              value={input.notes}
              onChange={(event) => updateField("notes", event.target.value)}
            />
          </Field>

          <button type="submit" className="h-12 rounded-card bg-brand px-5 text-sm font-bold text-bg transition hover:brightness-105">
            Score deal
          </button>
        </form>
      </AppCard>

      <AppCard className="lg:sticky lg:top-24 lg:self-start">
        <h2 className="text-2xl font-bold text-ink">Deal result</h2>
        {loading ? (
          <div className="mt-5 grid gap-3">{["Reading listing", "Comparing market data", "Estimating resale value", "Checking risk signals", "Building recommendation"].map((step) => <div key={step} className="rounded-card border border-line p-4 shimmer text-transparent">{step}</div>)}</div>
        ) : !result ? (
          <div className="mt-5 rounded-card border border-line bg-surface-2 p-4">
            <p className="text-sm leading-6 text-muted">
              Submit the form to see a Buy / Maybe / Pass result, Snagd Score, estimated profit, max offer, risk, and seller message.
            </p>
          </div>
        ) : (
          <div className="mt-5 grid gap-5">
            <div className="flex items-center justify-between gap-3">
              <RecommendationBadge value={result.recommendation} />
              <div className="text-right">
                <p className="font-mono text-4xl font-bold text-profit tnum">{result.snagdScore}</p>
                <p className="text-xs text-muted">Snagd Score</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ResultMetric label="Asking price" value={currency(result.askingPrice)} />
              <ResultMetric label="Estimated resale" value={currency(result.estimatedResaleValue)} />
              <ResultMetric label="Estimated profit" value={currency(result.estimatedProfit)} accent />
              <ResultMetric label="Suggested max offer" value={currency(result.suggestedMaxOffer)} />
              <ResultMetric label="Pickup cost" value={currency(result.pickupCostEstimate)} />
              <ResultMetric label="Repair cost" value={currency(result.repairCostEstimate)} />
              <ResultMetric label="Confidence" value={result.confidenceLevel} />
              <ResultMetric label="Time to sell" value={result.timeToSellEstimate} />
              <ResultMetric label="Based on sales" value={`${result.similarSalesCount}`} />
              <ResultMetric label="Under market" value={`${result.underMarketPercent}%`} accent />
              <ResultMetric label="Demand" value={result.demand} />
              <ResultMetric label="Competition" value={result.competition} />
            </div>

            <div className="flex flex-wrap gap-2">
              <RiskBadge value={result.riskLevel} />
              <span className="rounded-card border border-line px-2.5 py-1 text-xs text-muted">
                {result.confidenceLevel} confidence
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-ink">Plain-English explanation</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{result.explanation}</p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-ink">Suggested seller message</h3>
              <p className="mt-2 rounded-card border border-line bg-surface-2 p-3 text-sm leading-6 text-muted">{result.suggestedSellerMessage}</p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-ink">Red flags</h3>
              <ul className="mt-2 grid gap-2 text-sm text-muted">
                {result.redFlags.map((flag) => (
                  <li key={flag} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </AppCard>

      <style jsx>{`
        .field {
          width: 100%;
          border-radius: 8px;
          border: 1px solid var(--line);
          background: var(--surface-2);
          color: var(--ink);
          padding: 0.75rem 0.85rem;
          outline: none;
        }
        .field:focus {
          border-color: var(--info);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-ink">{label}</span>
      {children}
    </label>
  );
}

function ResultMetric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className={`mt-1 font-mono text-sm font-bold tnum ${accent ? "text-profit" : "text-ink"}`}>{value}</p>
    </div>
  );
}