"use client";

import { useState } from "react";
import { AppCard } from "@/components/app/AppCard";
import { currency } from "@/lib/format";
import { vinService } from "@/lib/services/vinService";
import { playScanBeep } from "@/lib/services/audioFeedbackService";
import type { VehicleVinResult } from "@/types/snagd";

export function VehicleModeClient() {
  const [vin, setVin] = useState("1HGCV1F3XMA123456");
  const [result, setResult] = useState<VehicleVinResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function decodeVin() {
    playScanBeep();
    setLoading(true);
    window.setTimeout(async () => { setResult(await vinService.decodeVin(vin)); setLoading(false); }, 800);
  }

  const vehicle = result ?? {
    vin,
    year: "2021",
    make: "Honda",
    model: "Accord",
    trim: "EX-L",
    bodyClass: "Sedan",
    engine: "1.5L Turbo",
    marketValueRange: "$21,300",
    estimatedFlipProfit: "$4,700",
    comparableVehicleCount: 38,
    suggestedMaxOffer: 18200,
    recommendation: "BUY",
    riskLevel: "Low",
    titleHistoryRisk: "Low",
    mileageRisk: "Low",
    marketDemand: "High",
    daysToSellEstimate: "6-12 days",
    aiSummary: "Strong resale demand in your area, high demand trim, and stable seasonal trend.",
    recalls: [],
    privatePartyComps: "38 similar local comps.",
    repairRisks: ["Confirm service records", "Inspect tires and brakes", "Scan for stored codes"],
    walkAwayWarnings: ["Title mismatch", "Unexplained warning lights", "Major accident history"],
  } as VehicleVinResult;

  return (
    <div className="mx-auto max-w-[430px]">
      <AppCard className="overflow-hidden rounded-[24px] p-0">
        <div className="px-5 pt-6 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-bold text-brand"><span className="grid h-5 w-5 place-items-center rounded-full bg-brand text-bg">✓</span>{result ? "SCAN COMPLETE" : "READY TO SCAN"}</div>
          <h1 className="mt-5 text-2xl font-bold text-ink">VIN Intelligence</h1>
          <p className="mt-2 font-mono text-sm text-muted">{vehicle.vin}</p>
          <p className="mt-3 text-lg font-semibold text-ink">{vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}</p>
        </div>

        <div className="mx-5 mt-5 h-40 rounded-[20px] border border-line image-card-vehicle" />

        <div className="mt-5 grid grid-cols-3 border-y border-line px-5 py-4 text-center">
          <VehicleMetric label="Est. Market Value" value={vehicle.marketValueRange} />
          <VehicleMetric label="Likely Profit" value={vehicle.estimatedFlipProfit} accent />
          <VehicleMetric label="Similar Sales" value={`${vehicle.comparableVehicleCount ?? 38}`} />
        </div>

        <div className="mx-5 mt-5 rounded-[18px] border border-brand/40 bg-brand/15 p-4">
          <div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-[14px] border border-brand/45 text-xl font-bold text-brand">88</span><div><p className="text-sm font-bold text-ink">Snagd Score</p><p className="text-xs text-muted">Great opportunity</p></div></div><div className="text-right"><p className="text-xs text-muted">Under market by</p><p className="text-2xl font-bold text-brand">27%</p></div></div>
        </div>

        <div className="mx-5 mt-4 grid grid-cols-3 gap-3">
          <Mini label="Mileage" value="58,420 mi" />
          <Mini label="Condition" value="Very Good" />
          <Mini label="Title" value="Clean" />
        </div>

        {loading ? <div className="mx-5 mt-5 grid gap-2">{["Scanning VIN", "Checking comps", "Building analysis"].map((step) => <div key={step} className="h-12 rounded-card shimmer" />)}</div> : <div className="mx-5 mt-5"><h2 className="font-bold text-ink">What we found</h2><ul className="mt-3 grid gap-2 text-sm text-muted">{[vehicle.aiSummary ?? "Strong resale demand in your area", `Average flip time: ${vehicle.daysToSellEstimate ?? "6-12 days"}`, "High demand trim in this market", "Seasonal trend: Stable"].map((item) => <li key={item} className="flex gap-2"><span className="text-brand">✓</span><span>{item}</span></li>)}</ul></div>}

        <div className="p-5">
          <button type="button" onClick={decodeVin} className="motion-press h-12 w-full rounded-[14px] bg-brand text-sm font-bold text-bg">{result ? "View Full Analysis" : "Scan VIN / Run Lookup"} →</button>
          <button type="button" onClick={() => setSaved(true)} className="motion-press mt-2 h-12 w-full rounded-[14px] border border-line bg-surface-2 text-sm font-bold text-ink">{saved ? "Saved & Monitoring" : "Save & Monitor"}</button>
        </div>
      </AppCard>

      <AppCard className="mt-4"><h2 className="text-lg font-bold text-ink">Plan access</h2><div className="mt-3 grid gap-2 text-sm text-muted"><p>Founder: manual VIN entry + basic decode placeholder</p><p>Pro: recall/risk/comps placeholder</p><p>Power Flipper: advanced profit checks, bulk VIN checks, saved vehicle checks</p></div></AppCard>
    </div>
  );
}

function VehicleMetric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) { return <div><p className="text-[11px] text-muted">{label}</p><p className={`mt-1 font-mono text-lg font-bold ${accent ? "text-amber" : "text-ink"}`}>{value}</p></div>; }
function Mini({ label, value }: { label: string; value: string }) { return <div className="rounded-[14px] border border-line bg-surface-2 p-3 text-center"><p className="text-[11px] text-muted">{label}</p><p className="mt-1 text-sm font-bold text-ink">{value}</p></div>; }