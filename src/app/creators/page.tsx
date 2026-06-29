import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Eyebrow } from "@/components/Eyebrow";
import { CTAButton } from "@/components/CTAButton";
import { Check } from "@/components/icons";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Creators & Partners",
  description:
    "Earn 30% recurring commission for every Snagd subscriber you refer — every month they stay subscribed. For creators whose audience flips.",
};

const steps = [
  { n: "01", t: "Grab your code", d: "Get a unique creator code and referral link from your partner dashboard." },
  { n: "02", t: "Share it", d: "Drop it in your videos, bio, and posts. Your audience gets a tool they'll actually use." },
  { n: "03", t: "Earn monthly", d: "Collect 30% of every referred subscription — recurring, for as long as they stay." },
];

const tracked = [
  "Referral clicks",
  "Trial signups",
  "Paid subscribers",
  "Active subscribers",
  "Monthly recurring commission",
  "Estimated payout",
  "Conversion rate",
  "Your creator code",
];

export default function CreatorsPage() {
  return (
    <>
      <section className="bg-grid">
        <Container className="py-16 sm:py-24">
          <div className="max-w-2xl">
            <Eyebrow>Creators &amp; partners</Eyebrow>
            <h1 className="mt-5 font-display text-4xl font-black leading-tight tracking-tight text-ink sm:text-6xl">
              Earn <span className="text-profit">30%</span> recurring, every month they stay.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">
              If your audience flips items, Snagd gives them a tool they can actually use — and you
              earn every month they stay subscribed. Not a one-time bounty. Real recurring revenue.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CTAButton
                href={site.creatorSignupUrl || "/support/"}
                className="px-7 py-3.5 text-base"
              >
                Become a partner
              </CTAButton>
              <CTAButton href="#how" variant="ghost" className="px-7 py-3.5 text-base">
                How it works
              </CTAButton>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { v: "30%", l: "Recurring commission" },
              { v: "∞", l: "Months you keep earning" },
              { v: "$0", l: "Cost to join" },
            ].map((s) => (
              <div key={s.l} className="rounded-card border border-line bg-surface p-6">
                <p className="font-mono text-4xl font-bold tnum text-profit">{s.v}</p>
                <p className="mt-1 text-sm text-muted">{s.l}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Section id="how" eyebrow="The deal" title="Three steps to recurring income">
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="rounded-card border border-line bg-surface p-6 shadow-card">
              <span className="font-mono text-sm font-bold text-profit">{s.n}</span>
              <h3 className="mt-3 font-display text-lg font-bold text-ink">{s.t}</h3>
              <p className="mt-2 text-sm text-muted">{s.d}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        eyebrow="Your dashboard"
        title="Track every click, signup, and dollar"
        intro="When the partner program goes live, your dashboard shows exactly what's working."
        className="pt-0"
      >
        <div className="mx-auto grid max-w-2xl gap-3 sm:grid-cols-2">
          {tracked.map((t) => (
            <div
              key={t}
              className="flex items-center gap-3 rounded-card border border-line bg-surface px-5 py-4"
            >
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-profit/15 text-profit">
                <Check className="h-3.5 w-3.5" />
              </span>
              <span className="text-sm text-ink">{t}</span>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-xl text-center font-mono text-[11px] uppercase tracking-widest text-muted">
          Partner dashboard launching with billing — join the list now
        </p>
      </Section>

      <section className="border-t border-line bg-grid">
        <Container className="py-16 text-center">
          <h2 className="font-display text-3xl font-black tracking-tight text-ink sm:text-4xl">
            Turn your flipping audience into income
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted">
            Get on the partner list and lock in your creator code before launch.
          </p>
          <CTAButton
            href={site.creatorSignupUrl || `mailto:${site.supportEmail}?subject=Snagd%20Creator%20Program`}
            className="mt-7 px-8 py-4 text-base"
          >
            Apply to become a partner
          </CTAButton>
        </Container>
      </section>
    </>
  );
}
