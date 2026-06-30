import Link from "next/link";
import { mockAlerts, mockDeals, priceAlerts, pricingPlans, todaysProfitOpportunities, trendingCategories } from "@/lib/mock-data";
import { currency } from "@/lib/format";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-bg">
        <div className="pointer-events-none absolute inset-0 soft-grid opacity-70" />
        <div className="pointer-events-none absolute right-[-10rem] top-[-12rem] hidden h-[520px] w-[520px] rounded-full bg-brand/10 blur-3xl lg:block" />
        <div className="relative mx-auto grid min-h-[86svh] max-w-shell gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="animate-rise">
            <p className="text-sm font-bold text-brand">Local resale intelligence</p>
            <h1 className="mt-4 text-5xl font-extrabold leading-[1.02] text-ink sm:text-6xl lg:text-7xl">
              Stop scrolling. Start snagging.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
              Snagd turns messy local listings into clear buy signals, profit ranges, seller actions, and watchlist alerts before the good flips disappear.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup/" className="inline-flex h-12 items-center justify-center rounded-card bg-brand px-6 text-sm font-bold text-white shadow-card">
                Start 7-day trial
              </Link>
              <Link href="/app/" className="inline-flex h-12 items-center justify-center rounded-card border border-line bg-surface/90 px-6 text-sm font-bold text-ink">
                Open demo app
              </Link>
            </div>
            <div className="mt-7 grid max-w-xl grid-cols-3 gap-3">
              <MiniMetric label="Opportunities" value={currency(todaysProfitOpportunities.total)} accent />
              <MiniMetric label="Starter" value={`$${pricingPlans[0].monthlyPrice}/mo`} accent />
              <MiniMetric label="Trial" value="7 days" />
            </div>
          </div>

          <ProfitCommandPanel />
        </div>
      </section>

      <Section id="how" eyebrow="How it works" title="A faster way to decide what is worth your time.">
        <div className="grid gap-4 md:grid-cols-3">
          <Feature title="Set the hunt" body="Choose a niche, area, budget, pickup distance, minimum profit, and minimum Snagd Score." />
          <Feature title="Read the signal" body="Snagd ranks listings by resale range, speed, risk, competition, and likely action value." />
          <Feature title="Move cleanly" body="Open the seller, save the deal, compare similar sales, and track profit after the flip." />
        </div>
      </Section>

      <Section eyebrow="Money map" title="See where the margin is building up.">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[22px] border border-line bg-surface p-5 shadow-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-brand">Profit momentum</p>
                <h3 className="mt-2 text-2xl font-extrabold text-ink">{currency(todaysProfitOpportunities.total)} nearby today</h3>
              </div>
              <span className="rounded-full border border-profit/30 bg-profit/10 px-3 py-1 text-sm font-bold text-profit">+18%</span>
            </div>
            <MomentumGraph />
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {trendingCategories.slice(0, 3).map((category, index) => (
                <div key={category.name} className="money-rise rounded-card border border-line bg-surface-2 p-3" style={{ animationDelay: `${index * 90}ms` }}>
                  <p className="text-sm font-bold text-ink">{category.name}</p>
                  <p className="mt-1 text-xs text-muted">{category.newDeals} new deals</p>
                  <p className="mt-2 font-mono text-lg font-bold text-profit">{currency(category.averageProfit)}</p>
                  <p className="text-xs text-muted">avg profit</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {priceAlerts.map((alert, index) => (
              <div key={alert.id} className="money-rise rounded-[18px] border border-line bg-surface p-4 shadow-soft" style={{ animationDelay: `${index * 80}ms` }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-ink">{alert.item}</p>
                    <p className="mt-1 text-sm text-muted">{alert.copy}</p>
                  </div>
                  <span className="rounded-full border border-brand/25 bg-brand/10 px-2.5 py-1 text-xs font-bold text-brand">Watchlist</span>
                </div>
                <p className="mt-3 text-xs text-muted">{alert.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section eyebrow="Marketplace feed" title="Representative local listings, scored like real opportunities.">
        <div className="grid gap-4 lg:grid-cols-3">
          {mockDeals.slice(0, 6).map((deal) => (
            <div key={deal.id} className="rounded-[18px] border border-line bg-surface p-4 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-muted">{deal.source} / {deal.timePosted}</p>
                  <h3 className="mt-1 font-bold text-ink">{deal.itemName}</h3>
                </div>
                <span className="font-mono text-lg font-bold text-brand">{deal.score}</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <MiniMetric label="Ask" value={deal.askingLabel} accent />
                <MiniMetric label="Resale" value={deal.estimatedResale} accent />
                <MiniMetric label="Profit" value={deal.estimatedProfit} accent />
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">{deal.reason}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Built to scale" title="Start with clean workflows. Add stronger data pipes as the app grows.">
        <div className="grid gap-4 md:grid-cols-3">
          <Feature title="Marketplace inputs" body="Seeded listing data today, structured provider slots for compliant listing sources later." />
          <Feature title="Model-ready scoring" body="The scoring boundary is ready for resale models, image recognition, VIN intelligence, and cost controls." />
          <Feature title="API key discipline" body="Provider keys belong server-side, with usage metering, alerts, billing, and audit trails around every paid call." />
        </div>
      </Section>

      <section className="border-t border-line bg-surface/40">
        <div className="mx-auto max-w-shell px-4 py-14 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-ink sm:text-4xl">Your next flip is already listed.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">
            Get the signal, compare the margin, message the seller, and track the outcome.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/signup/" className="inline-flex h-12 items-center justify-center rounded-card bg-brand px-6 text-sm font-bold text-white">
              Start free trial
            </Link>
            <Link href="/pricing/" className="inline-flex h-12 items-center justify-center rounded-card border border-line bg-surface px-6 text-sm font-bold text-ink">
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function ProfitCommandPanel() {
  return (
    <div className="float-soft rounded-[26px] border border-line bg-surface p-4 shadow-card">
      <div className="rounded-[22px] border border-line bg-surface-2 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-brand">Snagd dashboard</p>
            <h2 className="mt-2 text-3xl font-extrabold text-ink">{currency(todaysProfitOpportunities.total)}</h2>
            <p className="text-sm text-muted">profit opportunities nearby</p>
          </div>
          <span className="rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-sm font-bold text-brand">+{todaysProfitOpportunities.underMarketDeals} under market</span>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          <PanelStat label="New/hr" value={`${todaysProfitOpportunities.lastHourDeals}`} />
          <PanelStat label="High score" value={`${todaysProfitOpportunities.highScoreDeals}`} />
          <PanelStat label="Watchlists" value="20" />
        </div>
        <div className="mt-5 grid gap-3">
          {mockAlerts.slice(0, 3).map((alert, index) => (
            <div key={alert.id} className="money-rise rounded-card border border-line bg-surface p-3" style={{ animationDelay: `${index * 110}ms` }}>
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-bold text-ink">{alert.item}</p>
                <p className="font-mono text-sm font-bold text-profit">{alert.profit}</p>
              </div>
              <p className="mt-1 text-xs text-muted">{alert.type} / {alert.distance}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MomentumGraph() {
  const bars = [36, 48, 44, 61, 72, 67, 84];
  return (
    <div className="mt-6 rounded-[18px] border border-line bg-surface-2 p-4">
      <svg viewBox="0 0 420 180" className="h-44 w-full" role="img" aria-label="Profit graph trending upward">
        <defs>
          <linearGradient id="snagdLine" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="var(--brand)" />
            <stop offset="100%" stopColor="var(--profit)" />
          </linearGradient>
        </defs>
        {bars.map((height, index) => (
          <rect key={index} className="graph-bar" x={28 + index * 54} y={150 - height} width="28" height={height} rx="8" fill="var(--brand)" opacity="0.24" style={{ animationDelay: `${index * 70}ms` }} />
        ))}
        <path className="profit-line" d="M32 132 C86 120 104 98 154 104 C208 110 218 68 268 72 C318 76 336 42 388 34" fill="none" stroke="url(#snagdLine)" strokeWidth="6" strokeLinecap="round" />
        <circle cx="388" cy="34" r="8" fill="var(--profit)" />
      </svg>
    </div>
  );
}

function Section({ id, eyebrow, title, children }: { id?: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="border-b border-line bg-bg px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-shell">
        <p className="text-sm font-bold text-brand">{eyebrow}</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-bold text-ink sm:text-4xl">{title}</h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-card border border-line bg-surface p-5 shadow-card">
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted">{body}</p>
    </div>
  );
}

function MiniMetric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className={`mt-1 font-mono text-sm font-bold tnum ${accent ? "text-profit" : "text-ink"}`}>{value}</p>
    </div>
  );
}

function PanelStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-line bg-surface p-3">
      <p className="text-[11px] text-muted">{label}</p>
      <p className="mt-1 font-mono text-lg font-bold text-brand">{value}</p>
    </div>
  );
}

