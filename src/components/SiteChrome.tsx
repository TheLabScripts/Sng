"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

const chromeFreePrefixes = ["/app", "/login", "/signup", "/onboarding"];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome = chromeFreePrefixes.some((prefix) => pathname.startsWith(prefix));

  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  );
}