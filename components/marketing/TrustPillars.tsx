import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import { MotionStagger, MotionStaggerItem } from "@/components/shared/MotionStagger";
import { TRUST_PILLARS } from "@/data/trust-pillars";

export default function TrustPillars() {
  return (
    <Section className="bg-paper">
      <Container>
        <p className="text-ink/55 text-[11px] uppercase tracking-[0.24em]">The Pulse difference</p>
        <h2 className="sr-only">The Pulse difference, in three lines.</h2>
        <MotionStagger className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-16">
          {TRUST_PILLARS.map((p) => (
            <MotionStaggerItem key={p.key}>
              <div className="border-brass/60 border-t pt-8">
                <p className="text-[10px] uppercase tracking-[0.3em] text-brass">{p.label}</p>
                <h3 className="mt-4 font-display text-2xl leading-snug sm:text-3xl">{p.heading}</h3>
                <p className="text-ink/65 mt-4 text-sm leading-relaxed sm:text-base">{p.body}</p>
              </div>
            </MotionStaggerItem>
          ))}
        </MotionStagger>
      </Container>
    </Section>
  );
}
