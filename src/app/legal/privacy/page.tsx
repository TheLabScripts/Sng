import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { LegalBody } from "@/components/LegalBody";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <Container className="py-16 sm:py-20">
      <LegalBody
        title="Privacy Policy"
        updated="July 1, 2026"
        sections={[
          ["Local-first workspace", "Snagd stores your optional profile, preferences, watchlists, saved deals, and activity locally on your device. This workspace data is not uploaded to a Snagd account."],
          ["Photos and camera", "Camera and photo-library access are optional and only requested when you open a scan workflow. VIN barcode frames and field-scan previews are processed on your device and are not uploaded by the current build."],
          ["VIN lookups", "A VIN you submit is sent through Snagd's Cloudflare endpoint to the U.S. National Highway Traffic Safety Administration to return manufacturer details and recall campaigns. The current build does not link VIN lookups to an account, but infrastructure providers may process network and request logs under their own policies."],
          ["Data we may receive", "If you contact support, we receive the information you send, such as your email address and message. Future cloud features will be documented here before they are enabled."],
          ["Third-party sources", "Snagd may analyze user-supplied listings and information from compliant data providers. Snagd does not automate marketplace logins or sell your personal information."],
          ["Retention and deletion", "Local data remains on your device until you remove it, clear the app, or uninstall Snagd. You can delete all Snagd data from Account > Delete local data."],
          ["Children", "Snagd is a business and productivity tool and is not directed to children under 13."],
          ["Contact", "For privacy questions or requests, email support@snagd.app."],
        ]}
      />
    </Container>
  );
}


