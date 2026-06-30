import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Eyebrow } from "@/components/Eyebrow";
import { StoreButtons } from "@/components/StoreButtons";
import { FAQList } from "@/components/FAQItem";
import { faqs } from "@/content/faqs";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with Snagd. FAQs, contact, and download links for iOS and Android.",
};

export default function SupportPage() {
  return (
    <>
      <section className="bg-grid">
        <Container className="py-16 text-center sm:py-20">
          <Eyebrow>Support</Eyebrow>
          <h1 className="mx-auto mt-5 max-w-2xl font-display text-4xl font-black tracking-tight text-ink sm:text-5xl">
            How can we help?
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-muted">
            Most answers are below. Still stuck? Reach the team directly â€” we actually reply.
          </p>
          <a
            href={`mailto:${site.supportEmail}`}
            className="mt-6 inline-block font-mono text-sm text-profit hover:underline"
          >
            {site.supportEmail}
          </a>
        </Container>
      </section>

      <Section eyebrow="Answers" title="Frequently asked">
        <FAQList faqs={faqs} />
      </Section>

      <section className="border-t border-line">
        <Container className="py-14 text-center">
          <h2 className="font-display text-2xl font-extrabold text-ink">Get the app</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Snagd lives on your phone. Download for iOS or Android to get started.
          </p>
          <div className="mt-6 flex justify-center">
            <StoreButtons />
          </div>
        </Container>
      </section>
    </>
  );
}

