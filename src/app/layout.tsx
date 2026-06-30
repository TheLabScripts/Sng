import type { Metadata, Viewport } from "next";
import { SiteChrome } from "@/components/SiteChrome";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://snagd.app"),
  applicationName: "Snagd",
  title: {
    default: "Snagd - Local flips worth chasing",
    template: "%s - Snagd",
  },
  description:
    "Snagd is a reseller command center for finding local flips, scoring deals, managing watchlists, and tracking Deal Checks.",
  keywords: [
    "reseller software",
    "flipping app",
    "deal analyzer",
    "watchlist alerts",
    "local resale tools",
    "vehicle flip tools",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Snagd",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "Snagd - Local flips worth chasing",
    description:
      "Stop scrolling. Start snagging. Know the profit before you buy and get alerted before good flips are gone.",
    siteName: "Snagd",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a1b26",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("snagd-theme");
    var theme = stored === "snagd-day" ? "snagd-day" : "tokyo-night";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme === "snagd-day" ? "light" : "dark";
  } catch (error) {
    document.documentElement.dataset.theme = "tokyo-night";
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="tokyo-night" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>
          <SiteChrome>{children}</SiteChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}

