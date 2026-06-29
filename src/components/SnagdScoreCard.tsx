import { Pin } from "./icons";

export type Verdict = "BUY" | "MAYBE" | "PASS";

export type DealCard = {
  title: string;
  asking: string;
  resale: string;
  profit: string;
  maxOffer?: string;
  score: number; // 0-100
  verdict: Verdict;
  distance?: string;
  risk?: "Low" | "Medium" | "High";
  note?: string;
};

const verdictStyles: Record<Verdict, { text: string; ring: string; bar: string }> = {
  BUY: { text: "text-profit", ring: "border-profit/40", bar: "bg-profit" },
  MAYBE: { text: "text-amber", ring: "border-amber/40", bar: "bg-amber" },
  PASS: { text: "text-pass", ring: "border-pass/40", bar: "bg-pass" },
};

const riskColor: Record<NonNullable<DealCard["risk"]>, string> = {
  Low: "text-profit",
  Medium: "text-amber",
  High: "text-pass",
};

export function SnagdScoreCard({
  deal,
  featured = false,
}: {
  deal: DealCard;
  featured?: boolean;
}) {
  const v = verdictStyles[deal.verdict];
  return (
    <div
      className={`relative overflow-hidden rounded-card border bg-surface p-5 shadow-card ${
        featured ? `${v.ring} ${deal.verdict === "BUY" ? "shadow-glow" : ""}` : "border-line"
      }`}
    >
      {/* HUD scan line accent */}
      <div className={`absolute inset-x-0 top-0 h-px ${v.bar} opacity-60`} aria-hidden />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate font-display text-base font-semibold text-ink">{deal.title}</p>
          {deal.distance && (
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted">
              <Pin className="h-3.5 w-3.5" />
              {deal.distance}
            </p>
          )}
        </div>
        <span
          className={`shrink-0 rounded-md border px-2.5 py-1 font-mono text-xs font-bold tracking-wider ${v.text} ${v.ring}`}
        >
          {deal.verdict}
        </span>
      </div>

      {/* Score readout */}
      <div className="mt-4 flex items-end gap-3">
        <div className="flex items-baseline gap-1">
          <span className={`font-mono text-5xl font-bold leading-none tnum ${v.text}`}>
            {deal.score}
          </span>
          <span className="font-mono text-sm text-muted">/100</span>
        </div>
        <div className="mb-1 flex-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className={`h-full rounded-full ${v.bar}`}
              style={{ width: `${deal.score}%` }}
            />
          </div>
          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-widest text-muted">
            Snagd Score
          </p>
        </div>
      </div>

      {/* Money grid */}
      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line pt-4">
        <Row label="Asking" value={deal.asking} />
        <Row label="Est. resale" value={deal.resale} />
        <Row label="Est. profit" value={deal.profit} accent />
        {deal.maxOffer ? (
          <Row label="Max offer" value={deal.maxOffer} />
        ) : deal.risk ? (
          <Row label="Risk" value={deal.risk} className={riskColor[deal.risk]} />
        ) : null}
      </dl>

      {deal.note && (
        <p className="mt-4 rounded-lg bg-surface-2 px-3 py-2 text-xs text-muted">{deal.note}</p>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  accent = false,
  className = "",
}: {
  label: string;
  value: string;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="font-mono text-[10px] uppercase tracking-widest text-muted">{label}</dt>
      <dd
        className={`font-mono text-sm font-semibold tnum ${
          accent ? "text-profit" : "text-ink"
        } ${className}`}
      >
        {value}
      </dd>
    </div>
  );
}
