"use client";

import { useState } from "react";
import type { Faq } from "@/content/faqs";

export function FAQList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="mx-auto max-w-2xl divide-y divide-line rounded-card border border-line bg-surface">
      {faqs.map((f, i) => (
        <FAQItem key={i} faq={f} />
      ))}
    </div>
  );
}

function FAQItem({ faq }: { faq: Faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="px-5">
      <button
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="font-display text-base font-semibold text-ink">{faq.q}</span>
        <span
          className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line text-profit transition-transform ${
            open ? "rotate-45" : ""
          }`}
          aria-hidden
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      {open && <p className="pb-5 text-sm leading-relaxed text-muted">{faq.a}</p>}
    </div>
  );
}
