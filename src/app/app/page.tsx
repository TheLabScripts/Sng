import Link from "next/link";
import { AppCard } from "@/components/app/AppCard";
import { DealCard } from "@/components/app/DealCard";
import { UsageMeter } from "@/components/app/UsageMeter";
import { bestDealToday, lifetimeStats, mockAlerts, mockDeals, mockUsage, mockWatchlists, priceAlerts, savedDealSeeds, todaysProfitOpportunities, trendingCategories } from "@/lib/mock-data";
import { currency } from "@/lib/format";

const tools = [
  { label: "Analyze Listing", href: "/app/analyze/", copy: "Paste a listing and price-check it" },
  { label: "Field Scan", href: "/app/field-scan/", copy: "Photo scan a yard-sale find" },
  { label: "VIN Scan", href: "/app/vehicle-mode/", copy: "Decode and value a car" },
  { label: "Check Similar Sales", href: "/app/analyze/", copy: "Research sold comps" },
  { label: "Create Watchlist", href: "/app/watchlists/", copy: "Track a category or niche" },
  { label: "Saved Deals", href: "/app/saved/", copy: "Review saved flips" },
  { label: "Profit Tracker", href: "/app/stats/", copy: "Log buys and sales" },
  { label: "Price Alerts", href: "/app/alerts/", copy: "Watch drops nearby" },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto grid max-w-[430px] gap-5 md:max-w-shell">
      <section className="profit-hero motion-card overflow-hidden rounded-[20px] border border-profit/35 p-6 shadow-card">
        <p className="text-sm font-bold text-profit">Today&apos;s Profit Opportunities</p>
        <p className="mt-2 font-mono text-5xl font-extrabold tracking-tight text-profit">{currency(todaysProfitOpportunities.total)}</p>
        <p className="mt-2 text-base font-semibold text-ink">in profit opportunities nearby</p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs"><Mini value={`${todaysProfitOpportunities.lastHourDeals}`} label="new / hr" /><Mini value={`${todaysProfitOpportunities.highScoreDeals}`} label="AI picks" /><Mini value={`${todaysProfitOpportunities.underMarketDeals}`} label="30%+ under" /></div>
      </section>

      <section><div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold text-ink">Best Deal Today</h2><span className="text-sm font-bold text-profit">{bestDealToday.estimatedProfit}</span></div><DealCard deal={bestDealToday} /></section>

      <section><div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold text-ink">New Deals Last Hour</h2><Link href="/app/deal-feed/" className="text-sm font-bold text-brand">Open feed</Link></div><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{mockDeals.slice(0, 4).map((deal) => <DealCard key={deal.id} deal={deal} compact />)}</div></section>

      <section><div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold text-ink">Nearby Price Alerts</h2><span className="text-sm font-bold text-amber">{priceAlerts.length} active</span></div><div className="grid gap-2">{priceAlerts.map((alert) => <div key={alert.id} className="rounded-[16px] border border-line bg-surface p-3 shadow-soft"><p className="font-bold text-ink">{alert.copy}</p><p className="mt-1 text-sm text-muted">{alert.impact}</p></div>)}</div></section>

      <section><div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold text-ink">Trending Categories Nearby</h2><Link href="/app/deal-feed/" className="text-sm font-bold text-brand">Filter feed</Link></div><div className="grid grid-cols-2 gap-3 md:grid-cols-3">{trendingCategories.map((category) => <div key={category.name} className="rounded-[16px] border border-line bg-surface p-3 shadow-soft"><div className="flex items-center justify-between gap-2"><p className="font-bold text-ink">{category.name}</p><span className="text-xs font-bold text-brand">{category.trend}</span></div><p className="mt-1 text-xs text-muted">{category.newDeals} new deals / {category.demand} demand</p><p className="mt-2 font-mono text-lg font-bold text-profit">{currency(category.averageProfit)}</p><p className="text-xs text-muted">avg profit</p></div>)}</div></section>

      <section><div className="mb-3"><h2 className="text-lg font-bold text-ink">Tool Dock</h2><p className="mt-1 text-sm text-muted">Open the workflow you need in the field.</p></div><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{tools.map((tool) => <Link key={tool.label} href={tool.href} className="motion-press rounded-[18px] border border-line bg-surface p-4 shadow-soft hover:border-brand"><p className="font-bold text-ink">{tool.label}</p><p className="mt-2 text-xs leading-5 text-muted">{tool.copy}</p></Link>)}</div></section>

      <section className="grid gap-3 md:grid-cols-3">
        <AppCard><div className="flex items-center justify-between"><h2 className="text-lg font-bold text-ink">Recent Alerts</h2><Link href="/app/alerts/" className="text-sm font-bold text-brand">All</Link></div><div className="mt-3 grid gap-2">{mockAlerts.slice(0, 3).map((alert) => <p key={alert.id} className="rounded-card border border-line bg-surface-2 p-3 text-sm text-muted"><span className="font-bold text-ink">{alert.type}:</span> {alert.item} <span className="font-bold text-profit">{alert.profit}</span></p>)}</div></AppCard>
        <AppCard><div className="flex items-center justify-between"><h2 className="text-lg font-bold text-ink">Active Watchlists</h2><Link href="/app/watchlists/" className="text-sm font-bold text-brand">Manage</Link></div><div className="mt-3 grid gap-2">{mockWatchlists.slice(0, 3).map((watchlist) => <p key={watchlist.id} className="rounded-card border border-line bg-surface-2 p-3 text-sm text-muted"><span className="font-bold text-ink">{watchlist.name}</span><br />Min profit <span className="text-profit">${watchlist.minimumEstimatedProfit}</span></p>)}</div></AppCard>
        <AppCard><div className="flex items-center justify-between"><h2 className="text-lg font-bold text-ink">Saved Deals</h2><Link href="/app/saved/" className="text-sm font-bold text-brand">Open</Link></div><p className="mt-3 font-mono text-3xl font-bold text-profit">{savedDealSeeds.length}</p><div className="mt-3 grid gap-2 text-sm text-muted">{savedDealSeeds.slice(0, 2).map((deal) => <p key={deal.id}>{deal.itemName} / {deal.estimatedProfit}</p>)}</div></AppCard>
      </section>

      <AppCard><div className="flex items-start justify-between gap-4"><div><h2 className="text-lg font-bold text-ink">Deal Checks Remaining</h2><p className="mt-1 text-sm text-muted">{mockUsage.dealChecksLimit - mockUsage.dealChecksUsed} checks left before {mockUsage.billingCycleEnds}</p></div><p className="font-mono text-2xl font-bold text-profit">{mockUsage.dealChecksLimit - mockUsage.dealChecksUsed}</p></div><div className="mt-4"><UsageMeter used={mockUsage.dealChecksUsed} limit={mockUsage.dealChecksLimit} label="Deal Checks used" /></div></AppCard>

      <section className="grid gap-3 md:grid-cols-[1.1fr_0.9fr]"><AppCard><h2 className="text-lg font-bold text-ink">Lifetime Stats</h2><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"><Stat label="Earnings" value={currency(lifetimeStats.lifetimeEarnings)} /><Stat label="Profit" value={currency(lifetimeStats.lifetimeProfit)} accent /><Stat label="Tracked" value={`${lifetimeStats.totalDealsTracked}`} /><Stat label="Bought" value={`${lifetimeStats.dealsBought}`} /><Stat label="Sold" value={`${lifetimeStats.dealsSold}`} /><Stat label="Avg profit" value={currency(lifetimeStats.averageProfitPerFlip)} accent /><Stat label="Best flip" value={lifetimeStats.bestDeal} /><Stat label="Win rate" value={`${lifetimeStats.winRate}%`} /><Stat label="Opportunities found" value={currency(lifetimeStats.totalEstimatedOpportunitiesFound)} accent /></div></AppCard><AppCard><h2 className="text-lg font-bold text-ink">Deal / Profit Streak</h2><div className="mt-4 grid gap-3 text-sm text-muted"><p>{lifetimeStats.dealStreak}</p><p>{lifetimeStats.profitStreak}</p><p>{lifetimeStats.weeklyActionStreak}</p><p>{savedDealSeeds.length} saved deals ready to review</p></div></AppCard></section>
    </div>
  );
}

function Mini({ value, label }: { value: string; label: string }) { return <div className="rounded-[14px] border border-line bg-surface/70 p-3"><p className="font-mono text-lg font-bold text-ink">{value}</p><p className="text-[11px] text-muted">{label}</p></div>; }
function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) { return <div><p className="text-xs text-muted">{label}</p><p className={`mt-1 text-sm font-bold ${accent ? "text-profit" : "text-ink"}`}>{value}</p></div>; }
