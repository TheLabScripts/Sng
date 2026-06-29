import type { Metadata, Viewport } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

// Fonts are loaded at runtime via <link> (see <head> below) rather than
// next/font's build-time fetch. This keeps the static export building in any
// environment (including offline CI) and avoids a build-time network dependency.
// Family → CSS variable mapping lives in globals.css.

export const metadata: Metadata = {
  metadataBase: new URL("https://snagd.app"),
  title: {
    default: "Snagd — Local flips worth chasing.",
    template: "%s — Snagd",
  },
  description:
    "Snagd is the AI deal scout for local resellers. Score listings, see estimated profit and a max offer, and get a Buy / Maybe / Pass before you message the seller. iOS & Android.",
  keywords: [
    "reseller app",
    "flipping app",
    "marketplace deal alerts",
    "facebook marketplace flipping",
    "local reselling",
    "deal scoring",
  ],
  openGraph: {
    title: "Snagd — Local flips worth chasing.",
    description:
      "Stop scrolling. Start snagging. Know the profit before you buy with AI deal scoring built for local resellers.",
    siteName: "Snagd",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0a0f0c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
