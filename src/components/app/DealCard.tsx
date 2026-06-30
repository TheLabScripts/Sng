import Link from "next/link";
import type { Deal } from "@/types/snagd";
import { RecommendationBadge, RiskBadge, ScoreBadge } from "@/components/app/Badges";

export function DealCard({ deal, compact = false }: { deal: Deal; compact?: boolean }) {
  return (
    <article className="rounded-card border border-line bg-surface p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted">{deal.category} / {deal.distance}</p>
          <h3 className="mt-1 text-lg font-bold text-ink">{deal.itemName}</h3>
        </div>
        <div className="text-right">
          <ScoreBadge score={deal.score} />
          <p className="text-xs text-muted">Score</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <Metric label="Ask" value={deal.askingLabel} />
        <Metric label="Resale" value={deal.estimatedResale} />
        <Metric label="Profit" value={deal.estimatedProfit} accent />
      </div>

      {!compact && <p className="mt-4 text-sm leading-6 text-muted">{deal.reason}</p>}
      {deal.note && <p className="mt-3 text-sm text-amber">{deal.note}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <RecommendationBadge value={deal.recommendation} />
        <RiskBadge value={deal.risk} />
        <span className="rounded-card border border-line px-2.5 py-1 text-xs text-muted">{deal.source}</span>
      </div>

      {!compact && (
        <Link
          href="/app/analyze/"
          className="mt-4 inline-flex h-10 items-center justify-center rounded-card bg-profit px-4 text-sm font-bold text-bg transition hover:brightness-105"
        >
          Analyze similar deal
        </Link>
      )}
    </article>
  );
}

function Metric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className={`mt-1 font-mono font-bold tnum ${accent ? "text-profit" : "text-ink"}`}>{value}</p>
    </div>
  );
}