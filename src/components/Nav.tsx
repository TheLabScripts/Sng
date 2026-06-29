"use client";

import Link from "next/link";
import { useState } from "react";
import { nav, site } from "@/content/site";
import { CTAButton } from "./CTAButton";

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-shell items-center justify-between px-5 sm:px-6">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <CTAButton href="/pricing/" className="px-5 py-2.5">
            Get Snagd
          </CTAButton>
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="relative block h-3 w-5">
            <span className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition-transform ${open ? "translate-y-1.5 rotate-45" : ""}`} />
            <span className={`absolute left-0 bottom-0 h-0.5 w-5 bg-current transition-transform ${open ? "-translate-y-1 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-bg md:hidden">
          <div className="mx-auto max-w-shell px-5 py-4">
            <nav className="flex flex-col gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm text-ink hover:bg-surface"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <CTAButton href="/pricing/" className="mt-3 w-full">
              Get Snagd
            </CTAButton>
          </div>
        </div>
      )}
    </header>
  );
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight text-ink">
      <span className="grid h-7 w-7 place-items-center rounded-md bg-profit text-bg">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
          <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" fill="currentColor" />
        </svg>
      </span>
      Snagd
    </span>
  );
}
