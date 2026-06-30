import Link from "next/link";
import { mockAlerts, mockDeals, pricingPlans } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-bg">
        <ProductScene />
        <div className="relative mx-auto flex min-h-[82svh] max-w-shell flex-col justify-center px-4 py-16 sm:px-6">
          <div className="max-w-2xl animate-rise">
            <p className="text-sm font-bold text-profit">Find local flips worth chasing.</p>
            <h1 className="mt-4 text-5xl font-extrabold leading-[1.02] text-ink sm:text-6xl lg:text-7xl">
              Stop scrolling. Start snagging.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
              Snagd is the reseller command center for watchlists, alerts, deal scoring, usage, and vehicle checks. Know the profit before you buy.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup/" className="inline-flex h-12 items-center justify-center rounded-card bg-brand px-6 text-sm font-bold text-white">
                Get Snagd
              </Link>
              <Link href="#how" className="inline-flex h-12 items-center justify-center rounded-card border border-line bg-surface/85 px-6 text-sm font-bold text-ink">
                See how it works
              </Link>
            </div>
            <p className="mt-5 text-sm text-muted">
              Built for furniture flippers, tool hunters, electronics resellers, vehicle flippers, and anyone who wants better decisions from local listings.
            </p>
          </div>
        </div>
      </section>

      <Section id="how" eyebrow="How it works" title="Don't just get more alerts. Get better decisions.">
        <div className="grid gap-4 md:grid-cols-3">
          <Feature title="Set your hunt" body="Choose a niche preset, ZIP or city, budget, pickup distance, minimum profit, and minimum Snagd Score." />
          <Feature title="Let Snagd filter" body="Watchlists and Everything Mode surface only the leads that match your area, budget, and margin rules." />
          <Feature title="Move with confidence" body="Deal Analyzer returns Buy, Maybe, or Pass with resale value, profit, max offer, risks, and a seller message." />
        </div>
      </Section>

      <Section eyebrow="Why it makes money" title="The math is visible before you message the seller.">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-card border border-line bg-surface p-5 shadow-card">
            <h3 className="text-xl font-bold text-ink">A $20/month command center</h3>
            <p className="mt-3 text-sm leading-6 text-muted">
              One avoided bad pickup or one faster profitable buy can cover the Founder plan. Snagd focuses on time saved, better offers, and fewer thin-margin mistakes.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <MiniMetric label="Founder plan" value="$20/mo" />
              <MiniMetric label="Deal Checks" value="100/mo" />
              <MiniMetric label="Watchlists" value="5" />
              <MiniMetric label="Everything Mode" value="Included" />
            </div>
          </div>
          <div className="grid gap-4">
            {mockDeals.slice(0, 3).map((deal) => (
              <div key={deal.id} className="rounded-card border border-line bg-surface p-4 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-ink">{deal.itemName}</h3>
                    <p className="mt-1 text-sm text-muted">{deal.reason}</p>
                  </div>
                  <span className="font-mono text-xl font-bold text-profit tnum">{deal.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section eyebrow="Everything Mode" title="No niche? Snagd can watch anything profitable.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-card border border-line bg-surface p-5 shadow-card">
            <p className="text-sm leading-6 text-muted">
              Everything Mode watches for any deal that clears your budget, distance, profit target, and minimum Snagd Score. It is built for resellers who care about margin more than category.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Furniture", "Tools", "Electronics", "Appliances", "Vehicles", "Free finds", "High-ticket", "Fast flips"].map((item) => (
                <span key={item} className="rounded-card border border-line bg-surface-2 px-3 py-2 text-sm text-muted">{item}</span>
              ))}
            </div>
          </div>
          <div className="rounded-card border border-line bg-surface p-5 shadow-card">
            <h3 className="text-lg font-bold text-ink">Recent alert logic</h3>
            <div className="mt-4 grid gap-3">
              {mockAlerts.slice(0, 4).map((alert) => (
                <div key={alert.id} className="border-b border-line pb-3 last:border-b-0 last:pb-0">
                  <p className="font-bold text-ink">{alert.type}</p>
                  <p className="mt-1 text-sm text-muted">{alert.why}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section eyebrow="Built safely" title="Source-layer placeholders now. Real integrations later.">
        <div className="grid gap-4 md:grid-cols-3">
          <Feature title="No unsafe scraping" body="The dev build uses user-supplied listings, manual source layers, and compliant placeholder data." />
          <Feature title="No login automation" body="Snagd does not ask for marketplace credentials or automate marketplace accounts." />
          <Feature title="Ready for APIs" body="Services are abstracted for scoring, VIN, comps, distance, notifications, and billing." />
        </div>
      </Section>

      <section className="border-t border-line bg-surface/40">
        <div className="mx-auto max-w-shell px-4 py-14 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-ink sm:text-4xl">Your next flip is already listed.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">
            Get alerted before the good flips are gone, then use Deal Analyzer to know what to offer.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/signup/" className="inline-flex h-12 items-center justify-center rounded-card bg-brand px-6 text-sm font-bold text-white">
              Get Snagd
            </Link>
            <Link href="/app/" className="inline-flex h-12 items-center justify-center rounded-card border border-line bg-surface px-6 text-sm font-bold text-ink">
              Open demo app
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function ProductScene() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden soft-grid opacity-75">
      <div className="absolute right-[-8rem] top-12 hidden w-[720px] rotate-[-4deg] rounded-card border border-line bg-surface/85 p-4 shadow-card lg:block">
        <div className="grid grid-cols-[1fr_0.8fr] gap-4">
          <div className="rounded-card border border-line bg-surface-2 p-4">
            <p className="text-sm text-muted">Dashboard</p>
            <h3 className="mt-2 text-2xl font-bold text-ink">Leather sectional couch</h3>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <MiniMetric label="Ask" value="$90" />
              <MiniMetric label="Profit" value="$100-$150" />
              <MiniMetric label="Score" value="91" />
            </div>
          </div>
          <div className="rounded-card border border-line bg-surface-2 p-4">
            <p className="text-sm text-muted">Everything Mode</p>
            <p className="mt-3 text-4xl font-bold text-profit">On</p>
            <p className="mt-3 text-sm text-muted">Budget, distance, profit, and score filters active.</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          {mockDeals.slice(1, 4).map((deal) => (
            <div key={deal.id} className="rounded-card border border-line bg-surface-2 p-3">
              <p className="truncate text-sm font-bold text-ink">{deal.itemName}</p>
              <p className="mt-1 text-xs text-muted">{deal.estimatedProfit}</p>
              <p className="mt-2 font-mono text-lg font-bold text-profit">{deal.score}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-b border-line bg-bg px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-shell">
        <p className="text-sm font-bold text-profit">{eyebrow}</p>
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

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-mono text-sm font-bold text-profit tnum">{value}</p>
    </div>
  );
}
