import Link from "next/link";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Eyebrow } from "@/components/Eyebrow";
import { CTAButton } from "@/components/CTAButton";
import { StoreButtons } from "@/components/StoreButtons";
import { MarketplaceStrip } from "@/components/MarketplaceStrip";
import { HowItWorks } from "@/components/HowItWorks";
import { FeatureRow } from "@/components/FeatureRow";
import { EverythingMode } from "@/components/EverythingMode";
import { Testimonial } from "@/components/Testimonial";
import { SnagdScoreCard } from "@/components/SnagdScoreCard";
import { FAQList } from "@/components/FAQItem";
import { Bolt, Filter, Gauge, Tag } from "@/components/icons";
import { mockDeals, heroDeal } from "@/components/mockDeals";
import { faqs } from "@/content/faqs";
import { trial } from "@/content/pricing";

export default function HomePage() {
  return (
    <>
      {/* ───────── Hero ───────── */}
      <section className="bg-grid">
        <Container className="grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-rise">
            <Eyebrow>The AI deal scout for local reselling</Eyebrow>
            <h1 className="mt-5 font-display text-4xl font-black leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Stop scrolling.
              <br />
              Start <span className="text-profit">snagging.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
              Know what to buy, what to offer, and what you can make — before you message the
              seller. Snagd scores local flips and tells you straight: Buy, Maybe, or Pass.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CTAButton href="/pricing/#download" className="px-7 py-3.5 text-base">
                Get Snagd
              </CTAButton>
              <CTAButton href="#how" variant="ghost" className="px-7 py-3.5 text-base">
                See how it works
              </CTAButton>
            </div>

            <div className="mt-6">
              <StoreButtons />
              <p className="mt-3 font-mono text-xs text-muted">
                {trial.days}-day free trial · cancel anytime
              </p>
            </div>
          </div>

          {/* Signature: the live deal-terminal readout */}
          <div className="animate-rise [animation-delay:120ms]">
            <div className="relative mx-auto max-w-sm">
              <div className="absolute -inset-4 -z-10 rounded-[28px] bg-profit/5 blur-2xl" aria-hidden />
              <SnagdScoreCard deal={heroDeal} featured />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <MiniStat label="Scanned today" value="1,284" />
                <MiniStat label="Avg. profit found" value="$118" accent />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <MarketplaceStrip />

      {/* ───────── Problem ───────── */}
      <Section
        eyebrow="The grind"
        title="The good flips are gone in minutes. You can't watch all day."
        intro="Most of what's listed is junk, overpriced, or already spoken for. By the time you scroll past it, message, and do the math in your head — someone with cash already showed up."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { t: "Endless scrolling", d: "Hours lost sifting listings to find one flip that's actually worth the drive." },
            { t: "Guessing the math", d: "Eyeballing resale value and hoping there's profit after pickup and repairs." },
            { t: "Beaten to it", d: "The underpriced gems sell fast — usually before you've even decided." },
          ].map((p) => (
            <div key={p.t} className="rounded-card border border-line bg-surface p-6">
              <h3 className="font-display text-lg font-bold text-ink">{p.t}</h3>
              <p className="mt-2 text-sm text-muted">{p.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <HowItWorks />

      {/* ───────── Feature: AI scoring ───────── */}
      <FeatureRow
        eyebrow="AI Snagd Score"
        title="A profit verdict, not just a price."
        body="Swoopa shows you a valuation and leaves the call to you. Snagd does the math and makes the call — a 0–100 score and a clear Buy, Maybe, or Pass, with the profit range and the most you should pay."
        bullets={[
          "Estimated resale value & profit range",
          "Suggested max offer so you never overpay",
          "Confidence and risk level on every deal",
          "Plain-English reason for the verdict",
        ]}
        visual={
          <div className="mx-auto max-w-sm">
            <SnagdScoreCard deal={mockDeals[1]} featured />
          </div>
        }
      />

      {/* ───────── Feature: alerts/watchlists ───────── */}
      <FeatureRow
        flip
        eyebrow="Watchlists & alerts"
        title="Set your hunt once. Snagd watches for you."
        body="Build Watchlists for the niches and areas you work. Snagd surfaces matching deals and pings you the moment something with real margin shows up — so you're first to the seller, not last."
        bullets={[
          "Saved deal watches by niche, area & budget",
          "High-score, underpriced & price-drop alerts",
          "Seller-urgency and free-item detection",
          "In-app + email now · SMS & Discord coming",
        ]}
        visual={
          <div className="mx-auto grid max-w-sm gap-3">
            {mockDeals.slice(2, 4).map((d) => (
              <SnagdScoreCard key={d.title} deal={d} />
            ))}
          </div>
        }
      />

      {/* ───────── Feature: filtering ───────── */}
      <Section
        eyebrow="Less junk"
        title="Filters that cut the garbage, not the good stuff"
        intro="Snagd hides the overpriced, the broken, and the no-margin listings before they ever reach you — so the feed you see is only flips worth chasing."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: <Gauge />, t: "Margin filter", d: "Auto-hide anything without real profit room." },
            { icon: <Filter />, t: "Keyword controls", d: "Block 'broken', 'as-is', and your own no-go terms." },
            { icon: <Tag />, t: "Niche presets", d: "Furniture, tools, sneakers, appliances & more." },
            { icon: <Bolt />, t: "Everything Mode", d: "Watch for any item with strong upside." },
          ].map((f) => (
            <div key={f.t} className="rounded-card border border-line bg-surface p-6">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-profit/12 text-profit">
                {f.icon}
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-ink">{f.t}</h3>
              <p className="mt-1.5 text-sm text-muted">{f.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <EverythingMode />
      <Testimonial />

      {/* ───────── Pricing teaser ───────── */}
      <Section
        eyebrow="Priced for flippers, not dealers"
        title="More than Swoopa. A fraction of the price."
        intro="Swoopa's cheapest usable plan runs $47/mo and they built it for car dealers. Snagd starts at $19/mo billed yearly — built for everyday local flippers."
      >
        <div className="mx-auto flex max-w-md flex-col items-center gap-5 rounded-card border border-profit/40 bg-surface p-8 text-center shadow-glow">
          <span className="font-mono text-[11px] uppercase tracking-widest text-profit">
            Founder plan
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-5xl font-bold tnum text-ink">$19</span>
            <span className="text-muted">/mo billed yearly</span>
          </div>
          <p className="text-sm text-muted">
            100 Deal Checks · 5 Watchlists · Everything Mode · Buy/Maybe/Pass on every listing.
          </p>
          <CTAButton href="/pricing/" className="w-full">
            See all plans
          </CTAButton>
        </div>
      </Section>

      {/* ───────── Creator teaser ───────── */}
      <Container className="py-12 sm:py-16">
        <div className="flex flex-col items-start justify-between gap-6 rounded-card border border-line bg-gradient-to-r from-surface to-surface-2 p-8 sm:flex-row sm:items-center sm:p-10">
          <div className="max-w-xl">
            <Eyebrow>Creators &amp; partners</Eyebrow>
            <h3 className="mt-3 font-display text-2xl font-extrabold text-ink">
              If your audience flips, you should be earning from it.
            </h3>
            <p className="mt-2 text-sm text-muted">
              Earn 30% recurring commission for every subscriber you bring — every month they stay.
            </p>
          </div>
          <CTAButton href="/creators/" variant="ghost" className="shrink-0">
            Become a partner
          </CTAButton>
        </div>
      </Container>

      {/* ───────── FAQ ───────── */}
      <Section eyebrow="Questions" title="Need a hand?">
        <FAQList faqs={faqs.slice(0, 6)} />
        <p className="mt-6 text-center text-sm text-muted">
          More questions?{" "}
          <Link href="/support/" className="text-profit hover:underline">
            Visit support
          </Link>
          .
        </p>
      </Section>

      {/* ───────── Final CTA ───────── */}
      <section className="border-t border-line bg-grid">
        <Container className="py-20 text-center">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-black tracking-tight text-ink sm:text-5xl">
            Your area&rsquo;s next flip is already listed.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted">
            Let Snagd find it, score it, and tell you what it&rsquo;s worth. Get Snag&rsquo;d.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <CTAButton href="/pricing/#download" className="px-8 py-4 text-base">
              Get Snagd
            </CTAButton>
            <StoreButtons />
          </div>
        </Container>
      </section>
    </>
  );
}

function MiniStat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-line bg-surface px-4 py-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">{label}</p>
      <p className={`mt-1 font-mono text-xl font-bold tnum ${accent ? "text-profit" : "text-ink"}`}>
        {value}
      </p>
    </div>
  );
}
