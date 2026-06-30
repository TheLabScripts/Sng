import type { Metadata } from "next";
import Link from "next/link";
import { CreatorEarningsCalculator } from "@/components/CreatorEarningsCalculator";
import { creatorCommission, mockCreatorStats } from "@/lib/mock-data";
import { currency, numberCompact } from "@/lib/format";

export const metadata: Metadata = {
  title: "Creators",
  description: "Snagd creators earn 30% recurring commission while referred subscribers stay active.",
};

const flywheel = [
  { title: "Create useful content", body: "Show real deal checks, watchlists, alerts, and profit tracking instead of generic hype." },
  { title: "Audience starts flipping", body: "Followers get a practical tool for finding and scoring local opportunities." },
  { title: "You keep earning", body: "Creators earn while referred subscribers stay active and keep using Snagd." },
];

export default function CreatorsPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-bg px-4 py-16 sm:px-6">
        <div className="pointer-events-none absolute inset-0 soft-grid opacity-60" />
        <div className="relative mx-auto grid max-w-shell gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-sm font-bold text-brand">Creators and partners</p>
            <h1 className="mt-4 text-4xl font-extrabold text-ink sm:text-5xl">
              Earn <span className="text-profit">{creatorCommission.rate}%</span> recurring commission while your audience keeps flipping.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              Snagd gives reseller creators a product worth demonstrating: deal scoring, watchlists, alerts, vehicle intelligence, and a clear recurring incentive.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup/" className="inline-flex h-12 items-center justify-center rounded-card bg-brand px-6 text-sm font-bold text-white">
                Apply as creator
              </Link>
              <Link href="/app/creator/" className="inline-flex h-12 items-center justify-center rounded-card border border-line bg-surface px-6 text-sm font-bold text-ink">
                View creator dashboard
              </Link>
            </div>
          </div>

          <div className="rounded-[24px] border border-line bg-surface p-5 shadow-card">
            <p className="text-sm text-muted">Creator code</p>
            <h2 className="mt-2 text-3xl font-bold text-ink">{mockCreatorStats.creatorCode}</h2>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <Metric label="Referral clicks" value={numberCompact(mockCreatorStats.referralClicks)} />
              <Metric label="Trial signups" value={numberCompact(mockCreatorStats.trialSignups)} />
              <Metric label="Paid subscribers" value={numberCompact(mockCreatorStats.paidSubscribers)} />
              <Metric label="Active subscribers" value={numberCompact(mockCreatorStats.activeSubscribers)} />
              <Metric label="Monthly commission" value={currency(mockCreatorStats.monthlyRecurringCommission)} accent />
              <Metric label="Estimated payout" value={currency(mockCreatorStats.estimatedPayout)} accent />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bg px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-shell">
          <CreatorEarningsCalculator />
        </div>
      </section>

      <section className="border-y border-line bg-surface/45 px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-shell">
          <p className="text-sm font-bold text-brand">The referral flywheel</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-extrabold text-ink">Useful UGC brings users in, real product value keeps them subscribed.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {flywheel.map((item, index) => (
              <div key={item.title} className="rounded-card border border-line bg-surface p-5 shadow-card">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-sm font-bold text-white">{index + 1}</span>
                <h3 className="mt-4 text-lg font-bold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bg px-4 py-14 sm:px-6">
        <div className="mx-auto grid max-w-shell gap-4 md:grid-cols-3">
          <Feature title="Easy demos" body="Show the mobile app, Deal Analyzer, watchlists, billing, and Vehicle/VIN Intelligence in a few seconds." />
          <Feature title="Recurring incentive" body="Creators earn 30% while referred subscribers stay active." />
          <Feature title="Built for niches" body="Furniture, tools, electronics, cars, sneakers, appliances, and any profitable local category can become content." />
        </div>
      </section>
    </>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-card border border-line bg-surface p-5 shadow-card">
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-muted">{body}</p>
    </div>
  );
}

function Metric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className={`mt-1 font-mono text-lg font-bold tnum ${accent ? "text-profit" : "text-ink"}`}>{value}</p>
    </div>
  );
}
