// Minimal inline icon set â€” no icon library dependency.
type P = { className?: string };

export const Bolt = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" fill="currentColor" />
  </svg>
);
export const Filter = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M3 5h18l-7 8v5l-4 2v-7L3 5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
  </svg>
);
export const Gauge = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M4 18a8 8 0 1 1 16 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M12 14l4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);
export const Tag = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M3 12V4h8l9 9-7 7-9-9Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <circle cx="7.5" cy="7.5" r="1.4" fill="currentColor" />
  </svg>
);
export const Shield = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
  </svg>
);
export const Pin = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.7" />
  </svg>
);
export const Check = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="m5 12 5 5 9-11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const Plus = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

