"use client";

import { useState } from "react";
import { AppCard } from "@/components/app/AppCard";
import { currency } from "@/lib/format";
import { playScanBeep } from "@/lib/services/audioFeedbackService";
import { vehicleAuctionPhotoService } from "@/lib/services/vehicleAuctionPhotoService";
import { vehicleImageService } from "@/lib/services/vehicleImageService";
import { vehicleRiskService } from "@/lib/services/vehicleRiskService";
import { vinService } from "@/lib/services/vinService";
import type { VehicleVinResult } from "@/types/snagd";

const mockVin = "1HGCV1F3XMA123456";

export function VehicleModeClient() {
  const [vin, setVin] = useState(mockVin);
  const [mileage, setMileage] = useState(58420);
  const [asking, setAsking] = useState(18900);
  const [result, setResult] = useState<VehicleVinResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [saved, setSaved] = useState(false);
  const [interested, setInterested] = useState(false);
  const [copied, setCopied] = useState(false);

  async function runLookup(nextVin = vin) {
    setLoading(true);
    window.setTimeout(async () => {
      setResult(await vinService.decodeVin(nextVin));
      setLoading(false);
      setScanComplete(true);
    }, 700);
  }

  function simulateScan() {
    playScanBeep();
    setVin(mockVin);
    setScannerOpen(false);
    runLookup(mockVin);
  }

  function copyOffer() {
    navigator.clipboard?.writeText(`I can offer ${currency(vehicle.suggestedMaxOffer)} today if title and inspection check out.`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  const vehicle = result ?? defaultVehicle(vin);
  const vehicleImage = vehicleImageService.getBestImage(vehicle);
  const auctionSignal = vehicleAuctionPhotoService.findAuctionPhotoSignal(vehicle);
  const riskSummary = vehicleRiskService.summarize(vehicle);

  return (
    <div className="mx-auto grid max-w-[430px] gap-4 md:max-w-shell lg:grid-cols-[0.9fr_1.1fr]">
      <AppCard className="content-start">
        <p className="text-sm font-bold text-brand">Vehicle Mode</p>
        <h1 className="mt-1 text-2xl font-bold text-ink">Vehicle Profit Check</h1>
        <p className="mt-2 text-sm leading-6 text-muted">Scan a VIN first, then review value, risk, comps, offer, and walk-away signals.</p>
        <button type="button" onClick={() => setScannerOpen(true)} className="motion-press mt-5 h-14 w-full rounded-[16px] bg-brand text-base font-extrabold tracking-wide text-white shadow-card">SCAN</button>
        <div className="mt-4 grid gap-3 rounded-[18px] border border-line bg-surface-2 p-4">
          <p className="text-sm font-bold text-ink">Manual lookup</p>
          <label><span className="text-xs text-muted">VIN</span><input value={vin} onChange={(event) => setVin(event.target.value.toUpperCase())} className="mt-1 w-full rounded-card border border-line bg-surface p-3 font-mono text-sm text-ink" /></label>
          <div className="grid grid-cols-2 gap-3"><NumberInput label="Mileage" value={mileage} setValue={setMileage} /><NumberInput label="Asking price" value={asking} setValue={setAsking} /></div>
          <button type="button" onClick={() => { playScanBeep(); runLookup(); }} className="motion-press h-11 rounded-card border border-brand/35 bg-brand/10 text-sm font-bold text-brand">Run manual VIN lookup</button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3"><ScannerTile label="Door-jamb barcode" /><ScannerTile label="VIN OCR placeholder" /></div>
        <AppCard className="mt-4"><h2 className="text-lg font-bold text-ink">Plan access</h2><div className="mt-3 grid gap-2 text-sm text-muted"><p>Founder: manual VIN entry + basic decode placeholder</p><p>Pro: recall/risk/comps placeholder</p><p>Power Flipper: advanced profit checks, bulk VIN checks, saved vehicle checks</p></div><div className="mt-4 grid gap-2 text-sm"><Pack label="10 VIN Checks" price="$5" /><Pack label="50 VIN Checks" price="$19" /><Pack label="200 VIN Checks" price="$59" /></div></AppCard>
      </AppCard>

      <AppCard className="overflow-hidden rounded-[24px] p-0">
        <div className="px-5 pt-6 text-center"><div className="mx-auto inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-bold text-brand"><span className={`grid h-5 w-5 place-items-center rounded-full bg-brand text-white ${scanComplete ? "scan-success" : ""}`}>OK</span>{scanComplete ? "SCAN COMPLETE" : "READY FOR VIN CHECK"}</div><h2 className="mt-5 text-2xl font-bold text-ink">Vehicle Intelligence Report</h2><p className="mt-2 font-mono text-sm text-muted">{vehicle.vin}</p><p className="mt-3 text-lg font-semibold text-ink">{vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}</p></div>
        <div className="mx-5 mt-5 h-44 rounded-[20px] border border-line image-card-vehicle p-4"><div className="flex h-full flex-col justify-end"><p className="rounded-full bg-surface/80 px-3 py-1 text-xs font-bold text-ink">{vehicleImage.label}</p><p className="mt-2 rounded-full bg-surface/80 px-3 py-1 text-xs text-muted">{auctionSignal.label}</p></div></div>
        <div className="mt-5 grid grid-cols-3 border-y border-line px-5 py-4 text-center"><VehicleMetric label="Market Value" value={vehicle.marketValueRange} /><VehicleMetric label="Likely Profit" value={vehicle.estimatedFlipProfit} accent /><VehicleMetric label="Similar Sales" value={`${vehicle.comparableVehicleCount ?? 38}`} /></div>
        <div className="mx-5 mt-5 rounded-[18px] border border-profit/35 bg-profit/10 p-4"><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-[14px] border border-brand/45 text-xl font-bold text-brand">88</span><div><p className="text-sm font-bold text-ink">Buy/Maybe/Pass</p><p className="text-xs text-muted">{vehicle.recommendation} / {riskSummary.riskLevel} risk</p></div></div><div className="text-right"><p className="text-xs text-muted">Suggested offer</p><p className="text-xl font-bold text-profit">{currency(vehicle.suggestedMaxOffer)}</p></div></div></div>
        <div className="mx-5 mt-4 grid grid-cols-3 gap-3"><Mini label="Mileage" value={`${mileage.toLocaleString()} mi`} /><Mini label="Title Risk" value={vehicle.titleHistoryRisk} /><Mini label="Recall Risk" value={vehicle.recalls.length ? "Check" : "Low"} /></div>
        {loading ? <div className="mx-5 mt-5 grid gap-2">{["Decoding VIN", "Checking market value", "Reviewing risk signals", "Building offer"].map((step) => <div key={step} className="h-12 rounded-card shimmer" />)}</div> : <div className="mx-5 mt-5 grid gap-4"><ReportSection title="Value and market signals" items={[vehicle.aiSummary ?? "Strong resale demand", `Private-party comps: ${vehicle.privatePartyComps}`, `Expected sell time: ${vehicle.daysToSellEstimate ?? "6-12 days"}`, `Market demand: ${vehicle.marketDemand ?? "High"}`, `Asking input: ${currency(asking)}`]} /><ReportSection title="History and recall signals" items={[riskSummary.titleSignal, riskSummary.accidentSignal, riskSummary.odometerSignal, riskSummary.theftFloodSalvageSignal, auctionSignal.notes]} /><section><h3 className="font-bold text-ink">Repair checklist</h3><div className="mt-2 grid gap-2">{vehicle.repairRisks.map((risk) => <p key={risk} className="rounded-card border border-line bg-surface-2 p-3 text-sm text-muted">{risk}</p>)}</div></section><section><h3 className="font-bold text-ink">Walk-away warnings</h3><div className="mt-2 grid gap-2">{vehicle.walkAwayWarnings.map((warning) => <p key={warning} className="rounded-card border border-pass/30 bg-pass/10 p-3 text-sm text-pass">{warning}</p>)}</div></section></div>}
        <div className="sticky bottom-24 grid grid-cols-2 gap-2 p-5"><button type="button" onClick={() => setSaved(true)} className="rounded-[14px] border border-line bg-surface-2 px-3 py-3 text-sm font-bold text-ink">{saved ? "Saved" : "Save Vehicle"}</button><button type="button" onClick={copyOffer} className="rounded-[14px] border border-line bg-surface-2 px-3 py-3 text-sm font-bold text-ink">{copied ? "Copied" : "Copy Offer"}</button><button type="button" onClick={() => setInterested(true)} className="rounded-[14px] border border-profit/35 bg-profit/10 px-3 py-3 text-sm font-bold text-profit">{interested ? "Interested" : "Mark Interested"}</button><button type="button" className="rounded-[14px] bg-brand px-3 py-3 text-sm font-bold text-white">Open Notes</button></div>
      </AppCard>
      {scannerOpen && <VinScannerOverlay vin={mockVin} onClose={() => setScannerOpen(false)} onDetected={simulateScan} />}
    </div>
  );
}

function VinScannerOverlay({ vin, onClose, onDetected }: { vin: string; onClose: () => void; onDetected: () => void }) { return <div className="fixed inset-0 z-[100] bg-black text-white"><div className="mx-auto flex min-h-screen max-w-[430px] flex-col p-4"><div className="flex items-center justify-between"><button onClick={onClose} className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold">Close</button><button className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold">Flashlight</button></div><div className="grid flex-1 place-items-center"><div className="w-full"><p className="mb-5 text-center text-sm text-white/70">Line up the VIN barcode or door-jamb label</p><div className="relative mx-auto h-48 w-full max-w-[340px] rounded-[24px] border border-white/25 bg-white/[0.04] p-4 shadow-card"><span className="absolute left-4 top-4 h-8 w-8 rounded-tl-xl border-l-4 border-t-4 border-brand" /><span className="absolute right-4 top-4 h-8 w-8 rounded-tr-xl border-r-4 border-t-4 border-brand" /><span className="absolute bottom-4 left-4 h-8 w-8 rounded-bl-xl border-b-4 border-l-4 border-brand" /><span className="absolute bottom-4 right-4 h-8 w-8 rounded-br-xl border-b-4 border-r-4 border-brand" /><span className="scanner-frame absolute left-8 right-8 top-8 h-0.5 rounded-full" /><div className="grid h-full place-items-center text-center"><p className="font-mono text-xs text-white/60">{vin}</p></div></div><button onClick={onDetected} className="motion-press mt-6 h-12 w-full rounded-[14px] bg-brand text-sm font-bold text-white">Simulate VIN detection</button><button onClick={onClose} className="mt-3 h-11 w-full rounded-[14px] border border-white/20 bg-white/10 text-sm font-bold text-white">Manual entry fallback</button><p className="mt-5 text-center text-xs leading-5 text-white/55">Dev build uses a mocked scanner UI. Native should use Expo/React Native camera scanning, barcode scanning, OCR, and audio feedback.</p></div></div></div></div>; }
function defaultVehicle(vin: string): VehicleVinResult { return { vin, year: "2021", make: "Honda", model: "Accord", trim: "EX-L", bodyClass: "Sedan", engine: "1.5L Turbo", marketValueRange: "$21,300", estimatedFlipProfit: "$4,700", comparableVehicleCount: 38, suggestedMaxOffer: 18200, recommendation: "BUY", riskLevel: "Low", titleHistoryRisk: "Low", mileageRisk: "Low", marketDemand: "High", daysToSellEstimate: "6-12 days", aiSummary: "Strong resale demand in your area, high demand trim, and stable seasonal trend.", recalls: [], privatePartyComps: "38 similar local comps.", repairRisks: ["Confirm service records", "Inspect tires and brakes", "Scan for stored codes"], walkAwayWarnings: ["Title mismatch", "Unexplained warning lights", "Major accident history"] } as VehicleVinResult; }
function NumberInput({ label, value, setValue }: { label: string; value: number; setValue: (value: number) => void }) { return <label><span className="text-xs text-muted">{label}</span><input type="number" value={value} onChange={(event) => setValue(Number(event.target.value))} className="mt-1 w-full rounded-card border border-line bg-surface p-3 text-ink" /></label>; }
function ScannerTile({ label }: { label: string }) { return <button className="rounded-card border border-dashed border-brand/45 bg-brand/10 p-4 text-sm font-bold text-brand">{label}</button>; }
function Pack({ label, price }: { label: string; price: string }) { return <p className="flex items-center justify-between rounded-card border border-line bg-surface-2 p-3"><span>{label}</span><span className="font-mono font-bold text-profit">{price}</span></p>; }
function VehicleMetric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) { return <div><p className="text-[11px] text-muted">{label}</p><p className={`mt-1 font-mono text-lg font-bold ${accent ? "text-profit" : "text-ink"}`}>{value}</p></div>; }
function Mini({ label, value }: { label: string; value: string }) { return <div className="rounded-[14px] border border-line bg-surface-2 p-3 text-center"><p className="text-[11px] text-muted">{label}</p><p className="mt-1 text-sm font-bold text-ink">{value}</p></div>; }
function ReportSection({ title, items }: { title: string; items: string[] }) { return <section><h3 className="font-bold text-ink">{title}</h3><ul className="mt-3 grid gap-2 text-sm text-muted">{items.map((item) => <li key={item} className="flex gap-2"><span className="text-profit">OK</span><span>{item}</span></li>)}</ul></section>; }
