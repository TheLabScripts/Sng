import { ReactNode } from "react";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";

export function Section({
  eyebrow,
  title,
  intro,
  children,
  className = "",
  id,
}: {
  eyebrow?: string;
  title?: string;
  intro?: string;
  children?: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-16 sm:py-24 ${className}`}>
      <Container>
        {(eyebrow || title || intro) && (
          <div className="mx-auto mb-12 max-w-2xl text-center">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {title && (
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                {title}
              </h2>
            )}
            {intro && <p className="mt-4 text-base text-muted">{intro}</p>}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}

