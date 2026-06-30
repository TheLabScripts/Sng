import Link from "next/link";
import { AppCard } from "@/components/app/AppCard";
import { DealCard } from "@/components/app/DealCard";
import { bestDealToday, lifetimeStats, mockDeals, priceAlerts, savedDealSeeds, todaysProfitOpportunities, trendingCategories } from "@/lib/mock-data";
import { currency } from "@/lib/format";

export default function DashboardPage() {
  return (
    <div className="mx-auto grid max-w-[430px] gap-5 md:max-w-shell">
      <section className="profit-hero motion-card overflow-hidden rounded-[18px] border border-brand/45 p-6 shadow-card">
        <p className="text-5xl font-extrabold tracking-tight text-ink">{currency(todaysProfitOpportunities.total)}</p>
        <p className="mt-2 text-base font-semibold text-ink">in profit opportunities nearby</p>
        <p className="mt-3 text-sm text-muted">Updated just now / {todaysProfitOpportunities.lastHourDeals} new deals last hour</p>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold text-ink">New deals <span className="text-sm font-normal text-muted">/ last hour</span></h2><Link href="/app/deal-feed/" className="text-sm font-bold text-brand">See all</Link></div>
        <div className="grid gap-3 lg:grid-cols-2">{mockDeals.slice(0, 2).map((deal) => <DealCard key={deal.id} deal={deal} />)}</div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold text-ink">Nearby price alerts</h2><span className="text-sm text-brand">{priceAlerts.length} active</span></div>
        <div className="grid gap-2">{priceAlerts.map((alert) => <div key={alert.id} className="rounded-[16px] border border-line bg-[#111827]/90 p-3"><p className="font-bold text-ink">{alert.copy}</p><p className="mt-1 text-sm text-muted">{alert.impact}</p></div>)}</div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold text-ink">Trending categories</h2><Link href="/app/stats/" className="text-sm font-bold text-brand">See all</Link></div>
        <div className="grid grid-cols-3 gap-3">{trendingCategories.slice(0, 3).map((category) => <div key={category.name} className="rounded-[14px] border border-line bg-[#111827]/90 p-3"><p className="text-sm font-bold text-ink">{category.name}</p><p className="mt-1 text-xs text-muted">{category.newDeals} deals</p><p className="mt-2 font-mono text-sm font-bold text-amber">{currency(category.averageProfit)}</p></div>)}</div>
      </section>

      <div className="grid gap-3 md:grid-cols-3">
        <AppCard><p className="text-sm text-muted">Saved deals</p><p className="mt-1 text-3xl font-bold text-brand">{savedDealSeeds.length}</p></AppCard>
        <AppCard><p className="text-sm text-muted">Lifetime profit</p><p className="mt-1 text-3xl font-bold text-amber">{currency(lifetimeStats.lifetimeProfit)}</p></AppCard>
        <AppCard><p className="text-sm text-muted">Deal streak</p><p className="mt-1 text-lg font-bold text-ink">3 days</p></AppCard>
      </div>
    </div>
  );
}