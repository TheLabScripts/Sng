import Link from "next/link";
import { AppCard } from "@/components/app/AppCard";
import { mockAlerts } from "@/lib/mock-data";

const severityClasses = {
  profit: "text-profit",
  amber: "text-amber",
  risk: "text-pass",
  info: "text-info",
} as const;

export default function AlertsPage() {
  return (
    <div className="mx-auto max-w-shell">
      <div>
        <h2 className="text-2xl font-bold text-ink">Alerts</h2>
        <p className="mt-1 text-sm text-muted">Actionable alerts with the reason each one fired.</p>
      </div>

      <div className="mt-5 grid gap-4">
        {mockAlerts.map((alert) => (
          <AppCard key={alert.id}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className={`text-sm font-bold ${severityClasses[alert.severity]}`}>{alert.type}</p>
                <h3 className="mt-1 text-xl font-bold text-ink">{alert.item}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{alert.why}</p>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:min-w-[280px]">
                <AlertMetric label="Score" value={alert.score.toString()} />
                <AlertMetric label="Profit" value={alert.profit} />
                <AlertMetric label="Distance" value={alert.distance} />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
              <span className="text-sm text-muted">{alert.timePosted}</span>
              <Link href="/app/deal-feed/" className="text-sm font-bold text-info">View deal</Link>
            </div>
          </AppCard>
        ))}
      </div>
    </div>
  );
}

function AlertMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-mono text-sm font-bold text-ink tnum">{value}</p>
    </div>
  );
}