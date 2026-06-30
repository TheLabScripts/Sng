import Link from "next/link";
import { AppCard } from "@/components/app/AppCard";
import { DealCard } from "@/components/app/DealCard";
import { UsageMeter } from "@/components/app/UsageMeter";
import { bestDealToday, mockAlerts, mockUsage, mockWatchlists } from "@/lib/mock-data";

export default function DashboardPage() {
  const remainingDealChecks = mockUsage.dealChecksLimit - mockUsage.dealChecksUsed;
  const shouldPromptUpgrade = remainingDealChecks <= 20 || mockUsage.watchlistsLimit - mockUsage.watchlistsUsed <= 1;

  return (
    <div className="mx-auto grid max-w-shell gap-4 lg:grid-cols-[1.35fr_0.85fr]">
      <div className="grid gap-4">
        <AppCard>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted">Today&apos;s best lead</p>
              <h2 className="mt-1 text-2xl font-bold text-ink">Best deal today</h2>
            </div>
            <Link href="/app/analyze/" className="inline-flex h-11 items-center justify-center rounded-card bg-profit px-4 text-sm font-bold text-bg">
              Quick Analyze Deal
            </Link>
          </div>
          <div className="mt-5">
            <DealCard deal={bestDealToday} compact />
          </div>
        </AppCard>

        <div className="grid gap-4 sm:grid-cols-3">
          <DashboardStat label="Remaining Deal Checks" value={remainingDealChecks.toString()} detail={`${mockUsage.dealChecksLimit} monthly limit`} />
          <DashboardStat label="Active watchlists" value={mockWatchlists.length.toString()} detail={`${mockUsage.watchlistsUsed}/${mockUsage.watchlistsLimit} plan usage`} />
          <DashboardStat label="Everything Mode" value={mockUsage.everythingMode ? "On" : "Off"} detail="Watching all profitable categories" accent />
        </div>

        <AppCard>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-ink">Recent alerts</h2>
              <p className="mt-1 text-sm text-muted">The feed favors action, not noise.</p>
            </div>
            <Link href="/app/alerts/" className="text-sm font-bold text-info">View all</Link>
          </div>
          <div className="mt-4 divide-y divide-line">
            {mockAlerts.slice(0, 4).map((alert) => (
              <div key={alert.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-ink">{alert.type}</p>
                    <p className="text-sm text-muted">{alert.item} / {alert.distance}</p>
                  </div>
                  <p className="font-mono text-sm font-bold text-profit tnum">{alert.score}</p>
                </div>
                <p className="mt-1 text-sm text-muted">{alert.why}</p>
              </div>
            ))}
          </div>
        </AppCard>
      </div>

      <div className="grid content-start gap-4">
        <AppCard>
          <h2 className="text-lg font-bold text-ink">Usage</h2>
          <div className="mt-4 grid gap-4">
            <UsageMeter label="Deal Checks" used={mockUsage.dealChecksUsed} limit={mockUsage.dealChecksLimit} />
            <UsageMeter label="Watchlists" used={mockUsage.watchlistsUsed} limit={mockUsage.watchlistsLimit} />
          </div>
          <p className="mt-4 text-sm text-muted">Cycle ends {mockUsage.billingCycleEnds}.</p>
        </AppCard>

        {shouldPromptUpgrade && (
          <AppCard className="border-amber/45">
            <p className="text-sm font-bold text-amber">Upgrade makes sense soon</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              You are close to the Founder limits. Pro unlocks 500 Deal Checks, 20 watchlists, faster alerts, and priority settings.
            </p>
            <Link href="/app/billing/" className="mt-4 inline-flex h-10 items-center rounded-card bg-amber px-4 text-sm font-bold text-bg">
              Compare plans
            </Link>
          </AppCard>
        )}

        <AppCard>
          <h2 className="text-lg font-bold text-ink">Active watchlists</h2>
          <div className="mt-4 grid gap-3">
            {mockWatchlists.map((watchlist) => (
              <div key={watchlist.id} className="border-b border-line pb-3 last:border-b-0 last:pb-0">
                <p className="font-bold text-ink">{watchlist.name}</p>
                <p className="mt-1 text-sm text-muted">
                  {watchlist.location} / {watchlist.radius} mi / min score {watchlist.minimumSnagdScore}
                </p>
              </div>
            ))}
          </div>
        </AppCard>
      </div>
    </div>
  );
}

function DashboardStat({ label, value, detail, accent = false }: { label: string; value: string; detail: string; accent?: boolean }) {
  return (
    <AppCard>
      <p className="text-sm text-muted">{label}</p>
      <p className={`mt-2 font-mono text-3xl font-bold tnum ${accent ? "text-profit" : "text-ink"}`}>{value}</p>
      <p className="mt-2 text-sm text-muted">{detail}</p>
    </AppCard>
  );
}