import { AppCard } from "@/components/app/AppCard";
import { mockCreatorStats } from "@/lib/mock-data";
import { currency, numberCompact } from "@/lib/format";

export default function CreatorDashboardPage() {
  const metrics = [["Referral clicks", numberCompact(mockCreatorStats.referralClicks)], ["Trial signups", numberCompact(mockCreatorStats.trialSignups)], ["Paid subscribers", numberCompact(mockCreatorStats.paidSubscribers)], ["Active subscribers", numberCompact(mockCreatorStats.activeSubscribers)], ["Monthly commission", currency(mockCreatorStats.monthlyRecurringCommission)], ["Estimated payout", currency(mockCreatorStats.estimatedPayout)], ["Conversion rate", `${mockCreatorStats.conversionRate}%`]];
  return <div className="mx-auto max-w-shell"><AppCard className="brand-panel"><p className="text-sm text-muted">Creator Dashboard</p><h2 className="mt-1 text-3xl font-bold text-ink">{mockCreatorStats.creatorCode}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-muted">If your audience flips items, Snagd gives them a tool they can actually use - and you earn every month they stay subscribed.</p></AppCard><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{metrics.map(([label, value]) => <AppCard key={label}><p className="text-sm text-muted">{label}</p><p className="mt-2 font-mono text-2xl font-bold text-brand">{value}</p></AppCard>)}</div></div>;
}