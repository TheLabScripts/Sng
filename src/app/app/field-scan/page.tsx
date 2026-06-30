"use client";

import { useState } from "react";
import { AppCard } from "@/components/app/AppCard";
import { RecommendationBadge } from "@/components/app/Badges";
import { fieldScanResult } from "@/lib/mock-data";
import { currency } from "@/lib/format";

const steps = ["Reading image", "Identifying item", "Comparing similar sales", "Estimating resale value", "Building recommendation"];

export default function FieldScanPage() {
  const [loading, setLoading] = useState(false);
  const [resultVisible, setResultVisible] = useState(true);
  const [title, setTitle] = useState(fieldScanResult.itemDetected);
  function runScan() { setLoading(true); setResultVisible(false); window.setTimeout(() => { setLoading(false); setResultVisible(true); }, 1500); }
  return (
    <div className="mx-auto grid max-w-[430px] gap-4 md:max-w-shell lg:grid-cols-[0.85fr_1.15fr]">
      <div className="grid content-start gap-4">
        <AppCard>
          <p className="text-sm font-bold text-brand">Field Scan</p>
          <h1 className="mt-1 text-2xl font-bold text-ink">Photo-check an item before you buy</h1>
          <div className="mt-5 rounded-[18px] border border-dashed border-brand/45 bg-brand/10 p-6 text-center">
            <div className="mx-auto grid h-36 place-items-center rounded-[16px] border border-line bg-surface"><p className="text-sm font-bold text-muted">Camera / photo upload placeholder</p></div>
            <button onClick={runScan} className="motion-press mt-4 h-12 w-full rounded-[14px] bg-brand px-5 text-sm font-bold text-white">Run field scan</button>
          </div>
        </AppCard>
        <AppCard>
          <h2 className="text-lg font-bold text-ink">Scan progress</h2>
          <div className="mt-4 grid gap-2">{steps.map((step, index) => <div key={step} className={`rounded-card border border-line p-3 text-sm ${loading ? "shimmer text-transparent" : "bg-surface-2 text-muted"}`}>{loading ? "Scanning" : `${index + 1}. ${step}`}</div>)}</div>
        </AppCard>
      </div>

      <div className="grid content-start gap-4">
        {resultVisible ? <AppCard className="brand-ring">
          <div className="flex items-start justify-between gap-3"><div><p className="text-sm text-muted">AI item detected</p><h2 className="mt-1 text-2xl font-bold text-ink">{fieldScanResult.itemDetected}</h2><p className="mt-1 text-sm text-muted">{fieldScanResult.confidence} confidence / {fieldScanResult.suggestedCategory}</p></div><RecommendationBadge value={fieldScanResult.recommendation} /></div>
          <label className="mt-4 block"><span className="text-xs text-muted">Editable item title</span><input value={title} onChange={(event) => setTitle(event.target.value)} className="mt-1 w-full rounded-card border border-line bg-surface-2 p-3 text-ink" /></label>
          <div className="mt-5 grid grid-cols-2 gap-3"><Metric label="Estimated retail" value={currency(fieldScanResult.estimatedRetailPrice)} /><Metric label="Used resale range" value={fieldScanResult.estimatedResalePrice} /><Metric label="Based on" value={`${fieldScanResult.basedOnSales} sales`} /><Metric label="Expected sell time" value={fieldScanResult.sellThroughSpeed} /><Metric label="Demand" value={fieldScanResult.demand} /><Metric label="Max buy price" value={currency(fieldScanResult.suggestedMaxBuyPrice)} accent /><Metric label="Estimated profit" value={fieldScanResult.estimatedProfit} accent /></div>
          <div className="mt-4 rounded-[16px] border border-amber/35 bg-amber/10 p-4"><p className="text-sm font-bold text-amber">Buy / Maybe / Pass</p><p className="mt-1 text-sm text-muted">Recommendation: {fieldScanResult.recommendation}. Keep your buy price at or below {currency(fieldScanResult.suggestedMaxBuyPrice)}.</p></div>
          <div className="mt-4 grid gap-2">{fieldScanResult.riskNotes.map((note) => <p key={note} className="rounded-card border border-line bg-surface-2 p-3 text-sm text-muted">{note}</p>)}</div>
          <div className="mt-4 grid grid-cols-3 gap-2"><button className="rounded-card border border-line px-3 py-2 text-sm text-ink">Save scan</button><button className="rounded-card border border-line px-3 py-2 text-sm text-ink">Share scan</button><button className="rounded-card bg-brand px-3 py-2 text-sm font-bold text-white">Track deal</button></div>
        </AppCard> : <AppCard><div className="h-72 rounded-card shimmer" /></AppCard>}
        <AppCard><h2 className="text-lg font-bold text-ink">Recent Similar Sales</h2><div className="mt-4 grid gap-3">{fieldScanResult.recentSimilarSales.map((sale) => <div key={sale.id} className="rounded-card border border-line bg-surface-2 p-3"><p className="font-bold text-ink">{sale.itemTitle}</p><p className="text-sm text-muted">${sale.price} / {sale.condition} / {sale.source} / {sale.date}</p><p className="text-xs text-muted">{sale.matchConfidence} match. {sale.notes}</p></div>)}</div></AppCard>
      </div>
    </div>
  );
}
function Metric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) { return <div><p className="text-xs text-muted">{label}</p><p className={`mt-1 font-mono font-bold ${accent ? "text-amber" : "text-ink"}`}>{value}</p></div>; }
