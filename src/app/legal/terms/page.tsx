import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { LegalBody } from "@/components/LegalBody";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <Container className="py-16 sm:py-20">
      <LegalBody
        title="Terms of Service"
        updated="Draft terms. Legal review required before launch."
        sections={[
          ["The service", "Snagd provides estimated deal scores, resale ranges, and recommendations to help resellers evaluate listings. Estimates are guidance, not guarantees."],
          ["Your responsibility", "You make your own buying decisions. Snagd is a tool to inform them, not financial advice or a promise of profit."],
          ["Trials & billing", "Free trials require a card and convert to a paid plan unless cancelled. Cancel anytime; access continues through the paid period."],
          ["Acceptable use", "Don't misuse the service, attempt to scrape it, or use it to break any marketplace's terms or local law."],
          ["Changes", "We may update these terms and will note material changes. Continued use means acceptance."],
        ]}
      />
    </Container>
  );
}


