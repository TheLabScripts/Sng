import type { Recommendation, RiskLevel } from "@/types/snagd";

const recommendationClasses: Record<Recommendation, string> = {
  BUY: "border-profit/45 bg-profit/15 text-profit",
  MAYBE: "border-amber/45 bg-amber/15 text-amber",
  PASS: "border-pass/45 bg-pass/15 text-pass",
};

const riskClasses: Record<RiskLevel, string> = {
  Low: "border-profit/35 bg-profit/10 text-profit",
  Medium: "border-amber/35 bg-amber/10 text-amber",
  High: "border-pass/35 bg-pass/10 text-pass",
};

export function RecommendationBadge({ value }: { value: Recommendation }) {
  return (
    <span className={`inline-flex items-center rounded-card border px-2.5 py-1 text-xs font-bold ${recommendationClasses[value]}`}>
      {value}
    </span>
  );
}

export function RiskBadge({ value }: { value: RiskLevel }) {
  return (
    <span className={`inline-flex items-center rounded-card border px-2.5 py-1 text-xs font-bold ${riskClasses[value]}`}>
      {value} risk
    </span>
  );
}

export function ScoreBadge({ score }: { score: number }) {
  const tone = score >= 80 ? "text-profit" : score >= 65 ? "text-amber" : "text-pass";
  return <span className={`font-mono text-xl font-bold tnum ${tone}`}>{score}</span>;
}