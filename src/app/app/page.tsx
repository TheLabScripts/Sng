import Link from "next/link";
import { AppCard } from "@/components/app/AppCard";
import { DealCard } from "@/components/app/DealCard";
import { UsageMeter } from "@/components/app/UsageMeter";
import { bestDealToday, lifetimeStats, mockAlerts, mockDeals, mockUsage, mockWatchlists, priceAlerts, savedDealSeeds, todaysProfitOpportunities, trendingCategories } from "@/lib/mock-data";
import { currency } from "@/lib/format";

export default function DashboardPage() {
  const remainingDealChecks = mockUsage.dealChecksLimit - mockUsage.dealChecksUsed;
  return (
    <div className="mx-auto grid max-w-shell gap-4">
      <section className="brand-panel motion-card rounded-card border border-line p-5 shadow-card">
        <p className="text-sm text-muted">Today&apos;s Profit Opportunities</p>
        <div className="mt-2 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div><h2 className="text-4xl font-extrabold text-ink sm:text-5xl">{currency(todaysProfitOpportunities.total)} available nearby</h2><p className="mt-3 text-sm text-muted">{todaysProfitOpportunities.lastHourDeals} new deals in the last hour. {todaysProfitOpportunities.underMarketDeals} deals are 30%+ under market. Open app. See money. Act fast.</p></div>
          <Link href="/app/deal-feed/" className="motion-press inline-flex h-11 items-center justify-center rounded-card bg-brand px-5 text-sm font-bold text-bg">Review hot deals</Link>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <MoneyStat label="New Deals Last Hour" value="12" detail="4 high-score, 3 under market" />
            <MoneyStat label="Lifetime Profit" value={currency(lifetimeStats.lifetimeProfit)} detail={`${lifetimeStats.winRate}% win rate`} />
            <MoneyStat label="Deal Streak" value="3 days" detail={lifetimeStats.dealStreak} />
          </div>

          <AppCard>
            <div className="flex items-center justify-between gap-3"><div><h2 className="text-lg font-bold text-ink">Best Deal Today</h2><p className="mt-1 text-sm text-muted">Message seller before this disappears.</p></div><span className="rounded-card border border-amber/35 bg-amber/10 px-3 py-2 text-sm font-bold text-amber">Under market by 32%</span></div>
            <div className="mt-5"><DealCard deal={bestDealToday} compact /></div>
          </AppCard>

          <AppCard>
            <h2 className="text-lg font-bold text-ink">Trending Categories Nearby</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {trendingCategories.map((category) => <div key={category.name} className="rounded-card border border-line bg-surface-2 p-3"><div className="flex items-center justify-between"><p className="font-bold text-ink">{category.name}</p><span className="text-xs text-brand">{category.trend === "up" ? "Rising" : "Steady"}</span></div><p className="mt-2 font-mono text-xl font-bold text-amber">{currency(category.averageProfit)}</p><p className="mt-1 text-xs text-muted">{category.newDeals} new deals / {category.demand} demand</p></div>)}
            </div>
          </AppCard>
        </div>

        <div className="grid content-start gap-4">
          <AppCard><h2 className="text-lg font-bold text-ink">Nearby Price Alerts</h2><div className="mt-4 grid gap-3">{priceAlerts.map((alert) => <div key={alert.id} className="border-b border-line pb-3 last:border-b-0 last:pb-0"><p className="font-bold text-ink">{alert.copy}</p><p className="mt-1 text-sm text-muted">{alert.impact}</p></div>)}</div></AppCard>
          <AppCard><h2 className="text-lg font-bold text-ink">Deal Checks Remaining</h2><div className="mt-4"><UsageMeter label="Deal Checks" used={mockUsage.dealChecksUsed} limit={mockUsage.dealChecksLimit} /></div><p className="mt-3 text-sm text-muted">{remainingDealChecks} checks left this cycle.</p></AppCard>
          <AppCard><h2 className="text-lg font-bold text-ink">Recent Alerts</h2><div className="mt-4 grid gap-3">{mockAlerts.slice(0, 4).map((alert) => <div key={alert.id}><p className="font-bold text-ink">{alert.type}</p><p className="text-sm text-muted">{alert.item} / {alert.profit} / score {alert.score}</p></div>)}</div></AppCard>
          <AppCard><h2 className="text-lg font-bold text-ink">Saved Deals</h2><p className="mt-2 text-3xl font-bold text-brand">{savedDealSeeds.length}</p><p className="mt-1 text-sm text-muted">Top saved: {savedDealSeeds[0].itemName}</p><Link href="/app/saved/" className="mt-3 inline-flex text-sm font-bold text-brand">View saved</Link></AppCard>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AppCard><h2 className="text-lg font-bold text-ink">Active Watchlists Producing Deals</h2><div className="mt-4 grid gap-3">{mockWatchlists.map((watchlist) => <div key={watchlist.id} className="flex items-center justify-between border-b border-line pb-3 last:border-b-0"><div><p className="font-bold text-ink">{watchlist.name}</p><p className="text-sm text-muted">{watchlist.location} / min score {watchlist.minimumSnagdScore}</p></div><span className="font-mono text-amber">{watchlist.producingDeals ?? 2}</span></div>)}</div></AppCard>
        <AppCard><h2 className="text-lg font-bold text-ink">Lifetime Stats</h2><div className="mt-4 grid grid-cols-2 gap-3 text-sm"><Stat label="Earnings" value={currency(lifetimeStats.lifetimeEarnings)} /><Stat label="Deals tracked" value={String(lifetimeStats.totalDealsTracked)} /><Stat label="Bought" value={String(lifetimeStats.dealsBought)} /><Stat label="Sold" value={String(lifetimeStats.dealsSold)} /><Stat label="Avg profit" value={currency(lifetimeStats.averageProfitPerFlip)} /><Stat label="Best flip" value={lifetimeStats.bestDeal} /></div></AppCard>
      </div>
    </div>
  );
}
function MoneyStat({ label, value, detail }: { label: string; value: string; detail: string }) { return <AppCard><p className="text-sm text-muted">{label}</p><p className="mt-2 font-mono text-3xl font-bold text-amber tnum">{value}</p><p className="mt-2 text-sm text-muted">{detail}</p></AppCard>; }
function Stat({ label, value }: { label: string; value: string }) { return <div className="rounded-card border border-line bg-surface-2 p-3"><p className="text-xs text-muted">{label}</p><p className="mt-1 font-bold text-ink">{value}</p></div>; }