"use client";

import { useState } from "react";
import { AppCard } from "@/components/app/AppCard";
import { RiskBadge } from "@/components/app/Badges";
import { currency } from "@/lib/format";
import { vinService } from "@/lib/services/vinService";
import type { VehicleVinResult } from "@/types/snagd";

export function VehicleModeClient() {
  const [vin, setVin] = useState("1HGCM82633A004352");
  const [result, setResult] = useState<VehicleVinResult | null>(null);

  async function decodeVin() {
    setResult(await vinService.decodeVin(vin));
  }

  return (
    <div className="mx-auto grid max-w-shell gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="grid content-start gap-4">
        <AppCard>
          <h2 className="text-2xl font-bold text-ink">Vehicle Mode</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Vehicle flips can score well, but title, history, mileage, and repair risk decide the buy.
          </p>
          <label className="mt-5 grid gap-2">
            <span className="text-sm font-bold text-ink">Manual VIN entry</span>
            <input
              value={vin}
              onChange={(event) => setVin(event.target.value.toUpperCase())}
              className="rounded-card border border-line bg-surface-2 px-3 py-3 font-mono text-sm text-ink"
              maxLength={17}
            />
          </label>
          <button type="button" onClick={decodeVin} className="mt-4 h-11 w-full rounded-card bg-profit px-4 text-sm font-bold text-bg">
            Decode and score vehicle
          </button>
        </AppCard>

        <AppCard>
          <h3 className="text-lg font-bold text-ink">Scan placeholders</h3>
          <div className="mt-4 grid gap-3">
            <ScanRow title="VIN camera scan" detail="Camera capture UI placeholder for mobile Safari testing." />
            <ScanRow title="VIN barcode scan" detail="Barcode scan placeholder for door-jamb labels." />
            <ScanRow title="VIN OCR/photo scan" detail="Photo OCR placeholder for windshield VIN plates." />
          </div>
        </AppCard>

        <AppCard>
          <h3 className="text-lg font-bold text-ink">Repair risk checklist</h3>
          <div className="mt-4 grid gap-3 text-sm text-muted">
            {["Title in seller name", "Cold start video", "OBD scan clear", "No overheating", "No frame rust", "Tires and brakes priced in"].map((item) => (
              <label key={item} className="flex items-center gap-3">
                <input type="checkbox" className="h-4 w-4 accent-[var(--profit)]" />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </AppCard>
      </div>

      <div className="grid content-start gap-4">
        <AppCard>
          <h3 className="text-lg font-bold text-ink">VIN result</h3>
          {!result ? (
            <p className="mt-3 text-sm leading-6 text-muted">
              Decode a VIN to populate the mock vPIC, recall, market value, title/history, and profit estimate modules.
            </p>
          ) : (
            <div className="mt-4 grid gap-5">
              <div>
                <p className="font-mono text-sm text-muted">{result.vin}</p>
                <h4 className="mt-1 text-2xl font-bold text-ink">
                  {result.year} {result.make} {result.model} {result.trim}
                </h4>
                <p className="mt-1 text-sm text-muted">{result.bodyClass} / {result.engine}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <VehicleMetric label="Market value estimate" value={result.marketValueRange} />
                <VehicleMetric label="Private-party comps" value={result.privatePartyComps} />
                <VehicleMetric label="Suggested max offer" value={currency(result.suggestedMaxOffer)} accent />
                <VehicleMetric label="Flip profit estimate" value={result.estimatedFlipProfit} accent />
              </div>

              <div className="flex flex-wrap gap-2">
                <RiskBadge value={result.titleHistoryRisk} />
                <span className="rounded-card border border-amber/35 bg-amber/10 px-2.5 py-1 text-xs font-bold text-amber">
                  {result.mileageRisk} mileage risk
                </span>
              </div>
            </div>
          )}
        </AppCard>

        {result && (
          <>
            <AppCard>
              <h3 className="text-lg font-bold text-ink">Recall check placeholder</h3>
              <ul className="mt-3 grid gap-2 text-sm text-muted">
                {result.recalls.map((recall) => (
                  <li key={recall} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-amber" />
                    <span>{recall}</span>
                  </li>
                ))}
              </ul>
            </AppCard>

            <AppCard>
              <h3 className="text-lg font-bold text-ink">Title/history and walk-away warnings</h3>
              <p className="mt-2 text-sm text-muted">NMVTIS-approved history provider placeholder will live behind this module.</p>
              <ul className="mt-4 grid gap-2 text-sm text-muted">
                {result.walkAwayWarnings.map((warning) => (
                  <li key={warning} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-pass" />
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </AppCard>

            <AppCard>
              <h3 className="text-lg font-bold text-ink">Repair risks</h3>
              <ul className="mt-3 grid gap-2 text-sm text-muted">
                {result.repairRisks.map((risk) => (
                  <li key={risk} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-info" />
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </AppCard>
          </>
        )}
      </div>
    </div>
  );
}

function ScanRow({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="border-b border-line pb-3 last:border-b-0 last:pb-0">
      <p className="font-bold text-ink">{title}</p>
      <p className="mt-1 text-sm text-muted">{detail}</p>
    </div>
  );
}

function VehicleMetric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className={`mt-1 text-sm font-bold ${accent ? "text-profit" : "text-ink"}`}>{value}</p>
    </div>
  );
}