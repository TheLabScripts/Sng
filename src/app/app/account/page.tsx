import Link from "next/link";
import { AccountSettingsClient } from "@/components/app/AccountSettingsClient";
import { AppCard } from "@/components/app/AppCard";
import { mockCreatorStats, mockUsage } from "@/lib/mock-data";
import { currency, numberCompact } from "@/lib/format";

export default function AccountPage() {
  return (
    <div className="mx-auto grid max-w-shell gap-4 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="grid content-start gap-4">
        <AppCard>
          <h2 className="text-2xl font-bold text-ink">Account</h2>
          <div className="mt-5 grid gap-4 text-sm">
            <AccountRow label="Name" value="Snagd tester" />
            <AccountRow label="Email" value="demo@snagd.app" />
            <AccountRow label="Plan" value={mockUsage.plan} />
            <AccountRow label="Theme" value="Snagd Light / Snagd Black saved locally" />
          </div>
        </AppCard>

        <AppCard>
          <h3 className="text-lg font-bold text-ink">Settings</h3>
          <div className="mt-4"><AccountSettingsClient /></div>
        </AppCard>
      </div>

      <AppCard>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div><p className="text-sm text-muted">Creator code dashboard</p><h2 className="mt-1 text-2xl font-bold text-ink">{mockCreatorStats.creatorCode}</h2></div>
          <Link href="/creators/" className="inline-flex h-10 items-center rounded-card border border-line px-3 text-sm text-muted">Creator page</Link>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted">If your audience flips items, Snagd gives them a tool they can actually use - and you earn every month they stay subscribed.</p>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <CreatorMetric label="Referral clicks" value={numberCompact(mockCreatorStats.referralClicks)} />
          <CreatorMetric label="Trial signups" value={numberCompact(mockCreatorStats.trialSignups)} />
          <CreatorMetric label="Paid subscribers" value={numberCompact(mockCreatorStats.paidSubscribers)} />
          <CreatorMetric label="Active subscribers" value={numberCompact(mockCreatorStats.activeSubscribers)} />
          <CreatorMetric label="Monthly commission" value={currency(mockCreatorStats.monthlyRecurringCommission)} accent />
          <CreatorMetric label="Estimated payout" value={currency(mockCreatorStats.estimatedPayout)} accent />
          <CreatorMetric label="Conversion rate" value={`${mockCreatorStats.conversionRate}%`} />
        </div>
      </AppCard>
    </div>
  );
}

function AccountRow({ label, value }: { label: string; value: string }) { return <div className="border-b border-line pb-3 last:border-b-0 last:pb-0"><p className="text-muted">{label}</p><p className="mt-1 font-bold text-ink">{value}</p></div>; }
function CreatorMetric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) { return <div><p className="text-xs text-muted">{label}</p><p className={`mt-1 font-mono text-lg font-bold tnum ${accent ? "text-profit" : "text-ink"}`}>{value}</p></div>; }

