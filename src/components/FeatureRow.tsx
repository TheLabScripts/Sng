import { ReactNode } from "react";
import { Container } from "./Container";
import { Check } from "./icons";

export function FeatureRow({
  eyebrow,
  title,
  body,
  bullets,
  visual,
  flip = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  bullets?: string[];
  visual: ReactNode;
  flip?: boolean;
}) {
  return (
    <Container className="py-12 sm:py-16">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className={flip ? "md:order-2" : ""}>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
            {eyebrow}
          </span>
          <h3 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {title}
          </h3>
          <p className="mt-4 text-base leading-relaxed text-muted">{body}</p>
          {bullets && (
            <ul className="mt-5 space-y-2.5">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-ink">
                  <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand/15 text-brand">
                    <Check className="h-3 w-3" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={flip ? "md:order-1" : ""}>{visual}</div>
      </div>
    </Container>
  );
}


