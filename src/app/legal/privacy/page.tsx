import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { LegalBody } from "@/components/LegalBody";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <Container className="py-16 sm:py-20">
      <LegalBody
        title="Privacy Policy"
        updated="Draft policy. Legal review required before launch."
        sections={[
          ["What we collect", "Account details you provide (email, plan), the listings you choose to analyze, and basic usage data to run and improve Snagd."],
          ["How we use it", "To deliver deal scoring, send the alerts you set up, process billing, and improve the product. We do not sell your personal data."],
          ["Listings & sources", "Snagd analyzes listings you bring in or that come through compliant source integrations. We do not scrape or log into third-party marketplaces."],
          ["Your choices", "You can edit your account, manage alerts, export, or delete your data. Contact us anytime to action a request."],
          ["Contact", "Questions about privacy? Email us and we'll help."],
        ]}
      />
    </Container>
  );
}


