import type { Metadata } from "next";
import Link from "next/link";
import { mockCreatorStats } from "@/lib/mock-data";
import { currency, numberCompact } from "@/lib/format";

export const metadata: Metadata = {
  title: "Creators",
  description: "Snagd creators earn 30% recurring commission while referred subscribers stay subscribed.",
};

export default function CreatorsPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-bg px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-shell gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm font-bold text-profit">Creators and partners</p>
            <h1 className="mt-4 text-4xl font-extrabold text-ink sm:text-5xl">
              Earn 30% recurring commission while your audience keeps flipping.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              If your audience flips items, Snagd gives them a tool they can actually use - and you earn every month they stay subscribed.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup/" className="inline-flex h-12 items-center justify-center rounded-card bg-brand px-6 text-sm font-bold text-white">
                Apply as creator
              </Link>
              <Link href="/app/account/" className="inline-flex h-12 items-center justify-center rounded-card border border-line bg-surface px-6 text-sm font-bold text-ink">
                View dashboard placeholder
              </Link>
            </div>
          </div>

          <div className="rounded-card border border-line bg-surface p-5 shadow-card">
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
        <div className="mx-auto grid max-w-shell gap-4 md:grid-cols-3">
          <Feature title="Useful to your audience" body="Snagd helps resellers find, score, and act on local flips instead of only watching generic product links." />
          <Feature title="Recurring by design" body="Earn 30% while referred subscribers stay subscribed, with creator code support in the Founder plan and above." />
          <Feature title="Built for demos" body="Show the mock app, Deal Analyzer, watchlists, alerts, billing, and Vehicle Mode without needing a live backend." />
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
