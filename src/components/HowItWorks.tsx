import { Section } from "./Section";

// A real 3-step sequence, so numbered markers actually encode order.
const steps = [
  {
    n: "01",
    title: "Set your hunt",
    body: "Tell Snagd what you flip, your area, how far you'll drive, your budget, and the profit you want. Pick a niche or flip the switch on Everything Mode.",
  },
  {
    n: "02",
    title: "Get the verdict",
    body: "Drop in a listing â€” paste the text, a link, or run the Analyzer. Snagd scores it 0â€“100 and calls it: Buy, Maybe, or Pass, with profit and a max offer.",
  },
  {
    n: "03",
    title: "Move before they do",
    body: "Snagd hands you a suggested offer and a ready-to-send message. You message the seller knowing the numbers â€” instead of guessing and hoping.",
  },
];

export function HowItWorks() {
  return (
    <Section
      id="how"
      eyebrow="From scroll to snag"
      title="Three steps from listing to profit"
      intro="No spreadsheets, no guessing, no scrolling for an hour to find one decent flip."
    >
      <ol className="grid gap-4 md:grid-cols-3">
        {steps.map((s) => (
          <li
            key={s.n}
            className="relative rounded-card border border-line bg-surface p-6 shadow-card"
          >
            <span className="font-mono text-sm font-bold text-brand">{s.n}</span>
            <h3 className="mt-3 font-display text-lg font-bold text-ink">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}


