"use client";

import { useState } from "react";
import { AppCard } from "@/components/app/AppCard";
import { currency } from "@/lib/format";
import { vinService } from "@/lib/services/vinService";
import { playScanBeep } from "@/lib/services/audioFeedbackService";
import type { VehicleVinResult } from "@/types/snagd";

export function VehicleModeClient() {
  const [vin, setVin] = useState("1HGCV1F3XMA123456");
  const [mileage, setMileage] = useState(58420);
  const [asking, setAsking] = useState(18900);
  const [result, setResult] = useState<VehicleVinResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function decodeVin() {
    playScanBeep();
    setLoading(true);
    window.setTimeout(async () => { setResult(await vinService.decodeVin(vin)); setLoading(false); }, 800);
  }

  const vehicle = result ?? {
    vin, year: "2021", make: "Honda", model: "Accord", trim: "EX-L", bodyClass: "Sedan", engine: "1.5L Turbo",
    marketValueRange: "$21,300", estimatedFlipProfit: "$4,700", comparableVehicleCount: 38, suggestedMaxOffer: 18200,
    recommendation: "BUY", riskLevel: "Low", titleHistoryRisk: "Low", mileageRisk: "Low", marketDemand: "High", daysToSellEstimate: "6-12 days",
    aiSummary: "Strong resale demand in your area, high demand trim, and stable seasonal trend.", recalls: [], privatePartyComps: "38 similar local comps.",
    repairRisks: ["Confirm service records", "Inspect tires and brakes", "Scan for stored codes"], walkAwayWarnings: ["Title mismatch", "Unexplained warning lights", "Major accident history"],
  } as VehicleVinResult;

  return (
    <div className="mx-auto grid max-w-[430px] gap-4 md:max-w-shell lg:grid-cols-[0.9fr_1.1fr]">
      <AppCard className="content-start">
        <p className="text-sm font-bold text-brand">Vehicle / VIN</p>
        <h1 className="mt-1 text-2xl font-bold text-ink">Car flipper check</h1>
        <div className="mt-4 grid gap-3">
          <label><span className="text-xs text-muted">Manual VIN lookup</span><input value={vin} onChange={(event) => setVin(event.target.value.toUpperCase())} className="mt-1 w-full rounded-card border border-line bg-surface-2 p-3 font-mono text-sm text-ink" /></label>
          <div className="grid grid-cols-2 gap-3"><NumberInput label="Mileage" value={mileage} setValue={setMileage} /><NumberInput label="Asking price" value={asking} setValue={setAsking} /></div>
          <div className="grid grid-cols-2 gap-3"><button className="rounded-card border border-dashed border-brand/45 bg-brand/10 p-4 text-sm font-bold text-brand">Door-jamb barcode placeholder</button><button className="rounded-card border border-dashed border-brand/45 bg-brand/10 p-4 text-sm font-bold text-brand">VIN OCR placeholder</button></div>
          <button type="button" onClick={decodeVin} className="motion-press h-12 rounded-[14px] bg-brand text-sm font-bold text-white">{result ? "Run Lookup Again" : "Scan VIN / Run Lookup"}</button>
        </div>
      </AppCard>

      <AppCard className="overflow-hidden rounded-[24px] p-0">
        <div className="px-5 pt-6 text-center"><div className="mx-auto inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-bold text-brand"><span className="grid h-5 w-5 place-items-center rounded-full bg-brand text-white">✓</span>{result ? "SCAN COMPLETE" : "READY TO SCAN"}</div><h2 className="mt-5 text-2xl font-bold text-ink">VIN Intelligence</h2><p className="mt-2 font-mono text-sm text-muted">{vehicle.vin}</p><p className="mt-3 text-lg font-semibold text-ink">{vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}</p></div>
        <div className="mx-5 mt-5 h-40 rounded-[20px] border border-line image-card-vehicle" />
        <div className="mt-5 grid grid-cols-3 border-y border-line px-5 py-4 text-center"><VehicleMetric label="Market Value" value={vehicle.marketValueRange} /><VehicleMetric label="Likely Profit" value={vehicle.estimatedFlipProfit} accent /><VehicleMetric label="Similar Sales" value={`${vehicle.comparableVehicleCount ?? 38}`} /></div>
        <div className="mx-5 mt-5 rounded-[18px] border border-brand/40 bg-brand/15 p-4"><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-[14px] border border-brand/45 text-xl font-bold text-brand">88</span><div><p className="text-sm font-bold text-ink">Snagd Score</p><p className="text-xs text-muted">{vehicle.recommendation} / {vehicle.riskLevel} risk</p></div></div><div className="text-right"><p className="text-xs text-muted">Suggested offer</p><p className="text-xl font-bold text-amber">{currency(vehicle.suggestedMaxOffer)}</p></div></div></div>
        <div className="mx-5 mt-4 grid grid-cols-3 gap-3"><Mini label="Mileage" value={`${mileage.toLocaleString()} mi`} /><Mini label="Title Risk" value={vehicle.titleHistoryRisk} /><Mini label="Recall Risk" value={vehicle.recalls.length ? "Check" : "Low"} /></div>
        {loading ? <div className="mx-5 mt-5 grid gap-2">{["Scanning VIN", "Checking values", "Building offer"].map((step) => <div key={step} className="h-12 rounded-card shimmer" />)}</div> : <div className="mx-5 mt-5 grid gap-4"><section><h3 className="font-bold text-ink">What we found</h3><ul className="mt-3 grid gap-2 text-sm text-muted">{[vehicle.aiSummary ?? "Strong resale demand", `Expected sell time: ${vehicle.daysToSellEstimate ?? "6-12 days"}`, `Market demand: ${vehicle.marketDemand ?? "High"}`, `Asking input: ${currency(asking)}`].map((item) => <li key={item} className="flex gap-2"><span className="text-brand">✓</span><span>{item}</span></li>)}</ul></section><section><h3 className="font-bold text-ink">Repair checklist</h3><div className="mt-2 grid gap-2">{vehicle.repairRisks.map((risk) => <p key={risk} className="rounded-card border border-line bg-surface-2 p-3 text-sm text-muted">{risk}</p>)}</div></section><section><h3 className="font-bold text-ink">Walk-away warnings</h3><div className="mt-2 grid gap-2">{vehicle.walkAwayWarnings.map((warning) => <p key={warning} className="rounded-card border border-pass/30 bg-pass/10 p-3 text-sm text-pass">{warning}</p>)}</div></section></div>}
        <div className="grid grid-cols-3 gap-2 p-5"><button type="button" onClick={() => setSaved(true)} className="rounded-[14px] border border-line bg-surface-2 px-3 py-3 text-sm font-bold text-ink">{saved ? "Saved" : "Save vehicle"}</button><button type="button" onClick={() => navigator.clipboard?.writeText(`I can offer ${currency(vehicle.suggestedMaxOffer)} today if title and inspection check out.`)} className="rounded-[14px] border border-line bg-surface-2 px-3 py-3 text-sm font-bold text-ink">Copy offer</button><button type="button" className="rounded-[14px] bg-brand px-3 py-3 text-sm font-bold text-white">Open notes</button></div>
      </AppCard>
    </div>
  );
}
function NumberInput({ label, value, setValue }: { label: string; value: number; setValue: (value: number) => void }) { return <label><span className="text-xs text-muted">{label}</span><input type="number" value={value} onChange={(event) => setValue(Number(event.target.value))} className="mt-1 w-full rounded-card border border-line bg-surface-2 p-3 text-ink" /></label>; }
function VehicleMetric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) { return <div><p className="text-[11px] text-muted">{label}</p><p className={`mt-1 font-mono text-lg font-bold ${accent ? "text-amber" : "text-ink"}`}>{value}</p></div>; }
function Mini({ label, value }: { label: string; value: string }) { return <div className="rounded-[14px] border border-line bg-surface-2 p-3 text-center"><p className="text-[11px] text-muted">{label}</p><p className="mt-1 text-sm font-bold text-ink">{value}</p></div>; }
