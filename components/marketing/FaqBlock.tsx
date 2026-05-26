import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import { MotionStagger, MotionStaggerItem } from "@/components/shared/MotionStagger";
import type { FaqItem } from "@/data/faqs";

// AEO surface. Use semantic <details>/<summary> for native expand + clean source.
// Pair with buildFaqPageJsonLd() on the rendering page.
export default function FaqBlock({
  items,
  heading = "Common questions",
  eyebrow = "FAQ",
}: {
  items: ReadonlyArray<FaqItem>;
  heading?: string;
  eyebrow?: string;
}) {
  return (
    <Section className="bg-paper">
      <Container>
        <p className="text-ink/55 text-[11px] uppercase tracking-[0.24em]">{eyebrow}</p>
        <h2 className="mt-4 max-w-3xl font-display text-3xl leading-[1.05] sm:text-4xl md:text-5xl">
          {heading}
        </h2>
        <MotionStagger className="mt-12 max-w-3xl">
          {items.map((it) => (
            <MotionStaggerItem key={it.q}>
              <details className="border-ink/10 group border-b py-6">
                <summary className="hover:text-ink/70 flex cursor-pointer list-none items-baseline justify-between gap-6">
                  <h3 className="font-display text-lg sm:text-xl">{it.q}</h3>
                  <span className="text-ink/50 shrink-0 text-xs transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="text-ink/70 mt-4 max-w-2xl text-sm leading-relaxed sm:text-base">
                  {it.a}
                </p>
              </details>
            </MotionStaggerItem>
          ))}
        </MotionStagger>
      </Container>
    </Section>
  );
}
