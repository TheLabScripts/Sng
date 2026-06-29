import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Eyebrow } from "@/components/Eyebrow";
import { StoreButtons } from "@/components/StoreButtons";
import { PricingToggle } from "@/components/PricingToggle";
import { FAQList } from "@/components/FAQItem";
import { Check } from "@/components/icons";
import { addOns, trial, competitor } from "@/content/pricing";
import { faqs } from "@/content/faqs";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Snagd plans from $19/mo billed yearly. More features than Swoopa at a fraction of the price — built for everyday local resellers. 7-day free trial.",
};

export default function PricingPage() {
  return (
    <>
      <section className="bg-grid">
        <Container className="py-16 text-center sm:py-20">
          <Eyebrow>Pricing</Eyebrow>
          <h1 className="mx-auto mt-5 max-w-2xl font-display text-4xl font-black tracking-tight text-ink sm:text-5xl">
            Pick a plan after your free trial
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Start free for {trial.days} days with full features. Commit when you&rsquo;re ready.
            Cancel anytime — no penalties, no fees.
          </p>
        </Container>
      </section>

      <Container className="pb-8">
        <PricingToggle />
        <p className="mt-6 text-center font-mono text-xs text-muted">{trial.note}</p>
      </Container>

      {/* Competitor comparison */}
      <Section
        eyebrow="The honest comparison"
        title="Why pay dealer prices to flip a couch?"
        intro="Swoopa pivoted to car dealers and priced like it. Here's the same money laid side by side."
      >
        <div className="mx-auto max-w-3xl overflow-hidden rounded-card border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2 font-mono text-[11px] uppercase tracking-widest text-muted">
              <tr>
                <th className="px-5 py-4">Tier</th>
                <th className="px-5 py-4 text-profit">Snagd</th>
                <th className="px-5 py-4">{competitor.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              <tr className="bg-surface">
                <td className="px-5 py-4 text-muted">Entry plan</td>
                <td className="px-5 py-4 font-mono font-bold text-profit">$19–29/mo</td>
                <td className="px-5 py-4 font-mono text-ink">
                  ${competitor.entryCommitted}–{competitor.entryMonthly}/mo
                </td>
              </tr>
              <tr className="bg-surface">
                <td className="px-5 py-4 text-muted">Most popular</td>
                <td className="px-5 py-4 font-mono font-bold text-profit">$39–59/mo</td>
                <td className="px-5 py-4 font-mono text-ink">
                  ${competitor.popularCommitted}–{competitor.popularMonthly}/mo
                </td>
              </tr>
              <tr className="bg-surface">
                <td className="px-5 py-4 text-muted">Built for</td>
                <td className="px-5 py-4 text-ink">Everyday local flippers</td>
                <td className="px-5 py-4 text-muted">Car dealers</td>
              </tr>
              <tr className="bg-surface">
                <td className="px-5 py-4 text-muted">Buy / Maybe / Pass verdict</td>
                <td className="px-5 py-4 text-profit"><Check /></td>
                <td className="px-5 py-4 text-muted">—</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mx-auto mt-4 max-w-3xl text-center font-mono text-[11px] text-muted">
          {competitor.name} pricing from their public site, shown for comparison. Snagd is not
          affiliated with {competitor.name}.
        </p>
      </Section>

      {/* Add-ons */}
      <Section eyebrow="Top-ups" title="Need more? Grab a pack." className="pt-0">
        <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {addOns.map((a) => (
            <div
              key={a.name}
              className="flex items-center justify-between rounded-card border border-line bg-surface px-5 py-4"
            >
              <span className="text-sm text-ink">{a.name}</span>
              <span className="font-mono font-bold text-profit">${a.price}</span>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-5 max-w-xl text-center text-sm text-muted">
          One Deal Check = one listing scored in depth. Watchlist alerts that surface deals
          don&rsquo;t burn your Deal Checks.
        </p>
      </Section>

      {/* Download CTA */}
      <section id="download" className="border-t border-line bg-grid">
        <Container className="py-16 text-center">
          <h2 className="font-display text-3xl font-black tracking-tight text-ink sm:text-4xl">
            Get Snagd on your phone
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted">
            Snagd is a free download for iOS and Android. Your {trial.days}-day trial starts when
            you set up your first hunt.
          </p>
          <div className="mt-7 flex justify-center">
            <StoreButtons />
          </div>
        </Container>
      </section>

      <Section eyebrow="Questions" title="Pricing FAQ">
        <FAQList faqs={faqs} />
      </Section>
    </>
  );
}
