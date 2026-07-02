"use client";

import { useEffect, useRef, useState } from "react";
import { AppCard } from "@/components/app/AppCard";
import { currency } from "@/lib/format";
import { playScanBeep, primeScanAudio } from "@/lib/services/audioFeedbackService";
import { vinService } from "@/lib/services/vinService";
import type { VehicleVinResult } from "@/types/snagd";

const sampleVin = "1HGCM82633A004352";

export function VehicleModeClient() {
  const [vin, setVin] = useState("");
  const [mileage, setMileage] = useState(0);
  const [asking, setAsking] = useState(0);
  const [targetResale, setTargetResale] = useState(0);
  const [repairBudget, setRepairBudget] = useState(0);
  const [minimumProfit, setMinimumProfit] = useState(2000);
  const [result, setResult] = useState<VehicleVinResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const estimatedProfit = targetResale > 0 ? targetResale - asking - repairBudget : 0;
  const suggestedMaxOffer = targetResale > 0 ? Math.max(0, targetResale - repairBudget - minimumProfit) : 0;

  async function runLookup(inputVin = vin) {
    const normalizedVin = normalizeVin(inputVin);
    setVin(normalizedVin);
    setError("");
    setSaved(false);
    setLoading(true);

    try {
      const vehicle = await vinService.decodeVin(normalizedVin);
      setResult(vehicle);
      playScanBeep();
      window.setTimeout(() => reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    } catch (lookupError) {
      setResult(null);
      setError(lookupError instanceof Error ? lookupError.message : "VIN lookup failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function openScanner() {
    await primeScanAudio();
    setError("");
    setScannerOpen(true);
  }

  function saveVehicle() {
    if (!result) return;
    window.localStorage.setItem("snagd-last-vehicle", JSON.stringify({ vehicle: result, mileage, asking, targetResale, repairBudget, minimumProfit, savedAt: new Date().toISOString() }));
    setSaved(true);
  }

  async function copySummary() {
    if (!result) return;
    const pricing = suggestedMaxOffer > 0 ? ` Suggested max offer: ${currency(suggestedMaxOffer)}.` : "";
    await navigator.clipboard?.writeText(`${result.year} ${result.make} ${result.model} ${result.trim} - VIN ${result.vin}.${pricing}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="mx-auto grid max-w-[430px] gap-4 md:max-w-shell lg:grid-cols-[0.88fr_1.12fr]">
      <div className="grid content-start gap-4">
        <AppCard>
          <p className="text-sm font-bold text-brand">Vehicle Mode</p>
          <h1 className="mt-1 text-2xl font-bold text-ink">Vehicle Intelligence</h1>
          <p className="mt-2 text-sm leading-6 text-muted">Scan a door-jamb barcode to open a Vehicle Intelligence Report with verified specifications and Recall &amp; Risk Signals.</p>
          <button type="button" onClick={openScanner} className="motion-press mt-5 h-16 w-full rounded-[16px] bg-brand text-lg font-extrabold tracking-[0.12em] text-white shadow-card">SCAN</button>

          <div className="mt-4 grid gap-3 rounded-[18px] border border-line bg-surface-2 p-4">
            <div className="flex items-center justify-between gap-3"><p className="text-sm font-bold text-ink">Manual VIN</p><button type="button" onClick={() => setVin(sampleVin)} className="text-xs font-bold text-brand">Use test VIN</button></div>
            <label><span className="text-xs text-muted">17-character VIN</span><input value={vin} maxLength={17} autoCapitalize="characters" autoCorrect="off" spellCheck={false} onChange={(event) => setVin(normalizeVin(event.target.value))} placeholder="1HGCM82633A004352" className="mt-1 w-full rounded-card border border-line bg-surface p-3 font-mono text-sm uppercase text-ink" /></label>
            <button type="button" disabled={loading} onClick={async () => { await primeScanAudio(); await runLookup(); }} className="motion-press h-11 rounded-card border border-brand/35 bg-brand/10 text-sm font-bold text-brand disabled:cursor-wait disabled:opacity-60">{loading ? "Building report..." : "Manual VIN lookup"}</button>
            {error && <p className="rounded-card border border-pass/30 bg-pass/10 p-3 text-sm text-pass" role="alert">{error}</p>}
          </div>
        </AppCard>

        <AppCard>
          <h2 className="text-lg font-bold text-ink">Deal math</h2>
          <p className="mt-1 text-xs leading-5 text-muted">Vehicle details and recall signals are checked first. Add your own target resale and repair budget until Market Value Signals are connected.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <NumberInput label="Mileage" value={mileage} setValue={setMileage} suffix="mi" />
            <NumberInput label="Seller asking" value={asking} setValue={setAsking} money />
            <NumberInput label="Target resale" value={targetResale} setValue={setTargetResale} money />
            <NumberInput label="Repair budget" value={repairBudget} setValue={setRepairBudget} money />
            <NumberInput label="Minimum profit" value={minimumProfit} setValue={setMinimumProfit} money />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Metric label="Estimated profit" value={targetResale ? currency(estimatedProfit) : "Add resale"} accent={estimatedProfit > 0} />
            <Metric label="Max offer" value={targetResale ? currency(suggestedMaxOffer) : "Add resale"} accent={suggestedMaxOffer > 0} />
          </div>
        </AppCard>
      </div>

      <div ref={reportRef} className="scroll-mt-24">
        {loading ? <LoadingReport /> : result ? (
          <AppCard className="overflow-hidden rounded-[24px] p-0">
            <div className="px-5 pt-6 text-center">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-profit/30 bg-profit/10 px-3 py-1 text-xs font-bold text-profit"><span className="scan-success grid h-5 w-5 place-items-center rounded-full bg-profit text-white">OK</span>VIN INTELLIGENCE READY</div>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-brand">Vehicle Intelligence Report</p>
              <h2 className="mt-4 text-2xl font-bold text-ink">{result.year} {result.make} {result.model}</h2>
              <p className="mt-1 text-sm font-semibold text-muted">{result.trim || result.bodyClass}</p>
              <p className="mt-3 font-mono text-sm text-muted">{result.vin}</p>
            </div>

            <div className="mx-5 mt-5 rounded-[20px] border border-line image-card-vehicle p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">VIN Intelligence</p>
              <p className="mt-2 text-sm leading-6 text-ink">{result.intelligenceSummary}</p>
            </div>

            <div className="mt-5 grid grid-cols-3 border-y border-line px-5 py-4 text-center">
              <VehicleMetric label="Body" value={result.bodyClass} />
              <VehicleMetric label="Fuel" value={result.fuelType || "Not reported"} />
              <VehicleMetric label="Recalls" value={`${result.recallDetails?.length || 0}`} accent={Boolean(result.recallDetails?.length)} />
            </div>

            <div className="grid gap-5 p-5">
              <section>
                <h3 className="font-bold text-ink">Vehicle details</h3>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Detail label="Engine" value={result.engine} />
                  <Detail label="Drive" value={result.driveType || "Not reported"} />
                  <Detail label="Transmission" value={result.transmission || "Not reported"} />
                  <Detail label="Built in" value={result.plantLocation || "Not reported"} />
                  <Detail label="Mileage entered" value={mileage ? `${mileage.toLocaleString()} mi` : "Not entered"} />
                  <Detail label="Seller asking" value={asking ? currency(asking) : "Not entered"} />
                </div>
              </section>

              <section>
                <div className="flex items-end justify-between gap-3"><div><h3 className="font-bold text-ink">Recall &amp; Risk Signals</h3><p className="mt-1 text-xs text-muted">Matched to this vehicle configuration.</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${result.recallDetails?.length ? "bg-amber/15 text-amber" : "bg-profit/15 text-profit"}`}>{result.recallDetails?.length || 0} found</span></div>
                <div className="mt-3 grid gap-2">
                  {result.recallDetails?.length ? result.recallDetails.slice(0, 5).map((recall) => <details key={recall.campaignNumber} className="rounded-card border border-amber/30 bg-amber/5 p-3"><summary className="cursor-pointer text-sm font-bold text-ink">{recall.component}</summary><p className="mt-2 text-xs leading-5 text-muted">Campaign {recall.campaignNumber}. {recall.summary}</p>{recall.remedy && <p className="mt-2 text-xs leading-5 text-muted"><strong className="text-ink">Remedy:</strong> {recall.remedy}</p>}</details>) : <p className="rounded-card border border-profit/30 bg-profit/10 p-3 text-sm text-profit">No campaigns were returned for this year, make, and model.</p>}
                  {(result.recallDetails?.length || 0) > 5 && <p className="text-xs text-muted">Showing 5 of {result.recallDetails?.length} campaigns.</p>}
                </div>
              </section>

              <section className="rounded-card border border-line bg-surface-2 p-4">
                <h3 className="font-bold text-ink">Signals not connected yet</h3>
                <p className="mt-2 text-sm leading-6 text-muted">Market Value Signals, Title/History Signals, Similar Vehicle Sales, and Auction/Sales History Signals remain unavailable until production data connections are enabled.</p>
              </section>
            </div>

            <div className="sticky bottom-24 grid grid-cols-2 gap-2 border-t border-line bg-surface/95 p-5 backdrop-blur">
              <button type="button" onClick={saveVehicle} className="rounded-[14px] border border-line bg-surface-2 px-3 py-3 text-sm font-bold text-ink">{saved ? "Saved" : "Save Vehicle"}</button>
              <button type="button" onClick={copySummary} className="rounded-[14px] bg-brand px-3 py-3 text-sm font-bold text-white">{copied ? "Copied" : "Copy Summary"}</button>
            </div>
          </AppCard>
        ) : (
          <AppCard className="grid min-h-[420px] place-items-center text-center">
            <div className="max-w-sm"><div className="mx-auto grid h-16 w-16 place-items-center rounded-[20px] border border-brand/35 bg-brand/10 text-2xl font-black text-brand">VIN</div><h2 className="mt-5 text-2xl font-bold text-ink">Ready when your car is</h2><p className="mt-2 text-sm leading-6 text-muted">Open the scanner and point it at the barcode on the driver-side door jamb. You can also type the windshield VIN manually.</p></div>
          </AppCard>
        )}
      </div>

      {scannerOpen && <VinScannerOverlay onClose={() => setScannerOpen(false)} onDetected={(detectedVin) => { setScannerOpen(false); void runLookup(detectedVin); }} />}
    </div>
  );
}

function VinScannerOverlay({ onClose, onDetected }: { onClose: () => void; onDetected: (vin: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const detectedRef = useRef(false);
  const [status, setStatus] = useState("Starting rear camera...");
  const [torchOn, setTorchOn] = useState(false);
  const [torchAvailable, setTorchAvailable] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function startScanner() {
      try {
        const { BrowserMultiFormatReader } = await import("@zxing/browser");
        const reader = new BrowserMultiFormatReader(undefined, { delayBetweenScanAttempts: 70, delayBetweenScanSuccess: 400 });
        if (!videoRef.current || !mounted) return;
        controlsRef.current = await reader.decodeFromConstraints(
          { video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false },
          videoRef.current,
          (scanResult, scanError, controls) => {
            if (scanResult && !detectedRef.current) {
              const detectedVin = extractVin(scanResult.getText());
              if (detectedVin) {
                detectedRef.current = true;
                setStatus("VIN found - loading vehicle...");
                controls.stop();
                onDetected(detectedVin);
              } else {
                setStatus("Barcode found, but it did not contain a 17-character VIN.");
              }
            } else if (scanError && scanError.name !== "NotFoundException") {
              setStatus("Keep the barcode inside the frame and hold steady.");
            }
          },
        );
        const track = (videoRef.current?.srcObject as MediaStream | null)?.getVideoTracks()[0];
        const capabilities = track?.getCapabilities() as MediaTrackCapabilities & { torch?: boolean };
        if (mounted) {
          setTorchAvailable(Boolean(capabilities?.torch));
          setStatus("Line up the VIN barcode or door-jamb label");
        }
      } catch {
        if (mounted) setStatus("Camera unavailable. Use HTTPS and allow camera access, or choose a photo below.");
      }
    }

    void startScanner();
    return () => {
      mounted = false;
      controlsRef.current?.stop();
    };
  }, [attempt, onDetected]);

  async function toggleTorch() {
    const track = (videoRef.current?.srcObject as MediaStream | null)?.getVideoTracks()[0];
    if (!track) return;
    const next = !torchOn;
    try {
      await track.applyConstraints({ advanced: [{ torch: next } as MediaTrackConstraintSet] });
      setTorchOn(next);
    } catch { setStatus("Phone light is not available in this browser."); }
  }

  function tryAgain() {
    controlsRef.current?.stop();
    detectedRef.current = false;
    setStatus("Restarting rear camera...");
    setAttempt((value) => value + 1);
  }

  async function scanPhoto(file?: File) {
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setStatus("Reading barcode from photo...");
    try {
      const { BrowserMultiFormatReader } = await import("@zxing/browser");
      const reader = new BrowserMultiFormatReader();
      const scanResult = await reader.decodeFromImageUrl(imageUrl);
      const detectedVin = extractVin(scanResult.getText());
      if (!detectedVin) throw new Error("No VIN barcode found");
      onDetected(detectedVin);
    } catch {
      setStatus("No VIN barcode found in that photo. Try closer or enter it manually.");
    } finally {
      URL.revokeObjectURL(imageUrl);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white" role="dialog" aria-modal="true" aria-label="VIN scanner">
      <div className="mx-auto flex min-h-[100svh] max-w-[520px] flex-col p-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between"><button onClick={onClose} className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold">Close</button><span className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold">LIVE</span></div>
        <div className="grid flex-1 place-items-center py-5">
          <div className="w-full">
            <p className="mb-2 text-center text-lg font-bold">Line up the VIN barcode or door-jamb label</p>
            <p className="mb-4 text-center text-sm text-white/70" aria-live="polite">{status}</p>
            <div className="relative mx-auto aspect-[3/4] max-h-[62svh] w-full overflow-hidden rounded-[24px] border border-white/25 bg-white/[0.04] shadow-card">
              <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
              <div className="absolute inset-x-5 top-1/2 h-36 -translate-y-1/2 rounded-[18px] border-2 border-brand bg-black/10 shadow-[0_0_0_999px_rgba(0,0,0,.28)]"><span className="scanner-frame absolute inset-x-3 top-1/2 h-0.5 rounded-full" /></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2"><button type="button" onClick={() => void toggleTorch()} disabled={!torchAvailable} className="h-11 rounded-[14px] border border-white/20 bg-white/10 text-sm font-bold disabled:opacity-40">{torchOn ? "Light off" : "Phone light"}</button><button type="button" onClick={tryAgain} className="h-11 rounded-[14px] border border-white/20 bg-white/10 text-sm font-bold">Try Again</button></div>
            <button type="button" onClick={() => onDetected(sampleVin)} className="mt-2 h-11 w-full rounded-[14px] border border-brand/60 bg-brand/20 text-sm font-bold text-white">Simulate successful scan</button>
            <label className="motion-press mt-2 inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-[14px] border border-white/20 bg-white/10 text-sm font-bold text-white">Scan from a photo<input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(event) => void scanPhoto(event.target.files?.[0])} /></label>
            <button onClick={onClose} className="mt-2 h-11 w-full rounded-[14px] border border-white/20 bg-white/10 text-sm font-bold text-white">Manual VIN fallback</button>
            <p className="mt-4 text-center text-xs leading-5 text-white/55">Camera access requires HTTPS on your phone. The scanner reads barcodes; plain windshield text still needs manual entry.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function normalizeVin(value: string) { return value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "").slice(0, 17); }
function extractVin(value: string) { return value.toUpperCase().match(/[A-HJ-NPR-Z0-9]{17}/)?.[0] || ""; }
function NumberInput({ label, value, setValue, money = false, suffix }: { label: string; value: number; setValue: (value: number) => void; money?: boolean; suffix?: string }) { return <label><span className="text-xs text-muted">{label}</span><div className="mt-1 flex items-center rounded-card border border-line bg-surface px-3"><span className="text-sm text-muted">{money ? "$" : ""}</span><input type="number" min="0" inputMode="numeric" value={value || ""} onChange={(event) => setValue(Number(event.target.value))} className="min-w-0 flex-1 bg-transparent p-3 text-ink outline-none" /><span className="text-xs text-muted">{suffix}</span></div></label>; }
function Metric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) { return <div className="rounded-card border border-line bg-surface-2 p-3"><p className="text-xs text-muted">{label}</p><p className={`mt-1 font-mono text-lg font-bold ${accent ? "text-profit" : "text-ink"}`}>{value}</p></div>; }
function Detail({ label, value }: { label: string; value: string }) { return <div className="rounded-card border border-line bg-surface-2 p-3"><p className="text-[11px] text-muted">{label}</p><p className="mt-1 text-sm font-bold text-ink">{value}</p></div>; }
function VehicleMetric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) { return <div><p className="text-[11px] text-muted">{label}</p><p className={`mt-1 text-sm font-bold ${accent ? "text-amber" : "text-ink"}`}>{value}</p></div>; }
function LoadingReport() { return <AppCard><div className="grid gap-3">{["Decoding VIN", "Loading manufacturer details", "Checking safety recalls", "Building vehicle report"].map((step) => <div key={step} className="h-14 rounded-card shimmer"><span className="sr-only">{step}</span></div>)}</div></AppCard>; }
