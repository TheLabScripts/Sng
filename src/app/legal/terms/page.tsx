import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { LegalBody } from "@/components/LegalBody";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <Container className="py-16 sm:py-20">
      <LegalBody
        title="Terms of Service"
        updated="July 1, 2026"
        sections={[
          ["The service", "Snagd provides estimated deal scores, resale ranges, and recommendations to help resellers evaluate listings. Estimates are guidance, not guarantees."],
          ["Your responsibility", "You make your own buying decisions. Snagd is a tool to inform them, not financial advice or a promise of profit."],
          ["Your data", "The current mobile build stores workspace data locally on your device. You are responsible for maintaining any backup you need and for deleting data before transferring your device."],
          ["Purchases", "The current mobile build does not require a purchase. If paid digital features are introduced, pricing and renewal terms will be shown before purchase and handled through the applicable app store."],
          ["Acceptable use", "Do not misuse the service, interfere with its operation, submit unlawful content, or use it to violate a marketplace's terms or applicable law."],
          ["Third-party services", "Listings, maps, market data, and other third-party information remain subject to their providers' terms and availability."],
          ["Availability", "We may update, suspend, or discontinue features. To the extent permitted by law, Snagd is provided without a guarantee that every estimate, source, or feature will always be available or accurate."],
          ["Changes and contact", "We may update these terms and will change the date above when we do. Questions can be sent to support@snagd.app."],
        ]}
      />
    </Container>
  );
}


