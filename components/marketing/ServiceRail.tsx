import Link from "next/link";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import { MotionStagger, MotionStaggerItem } from "@/components/shared/MotionStagger";

const services: ReadonlyArray<{ label: string; href: string; hint: string }> = [
  { label: "The Fleet", href: "/fleet", hint: "Exotic & supercars" },
  { label: "Jets", href: "/jets", hint: "On-demand charter" },
  { label: "Yachts", href: "/yachts", hint: "Day & multi-day" },
  { label: "Jet Skis", href: "/jet-skis", hint: "Delivered" },
  { label: "Chauffeur", href: "/chauffeur", hint: "Private driver program" },
  { label: "Concierge", href: "/concierge", hint: "Anything else" },
];

export default function ServiceRail() {
  return (
    <Section className="bg-paper">
      <Container>
        <p className="text-ink/55 text-[11px] uppercase tracking-[0.24em]">Services</p>
        <h2 className="mt-4 max-w-3xl font-display text-4xl leading-[1.02] sm:text-5xl md:text-6xl">
          One operator, every category.
        </h2>
        <MotionStagger className="border-ink/10 mt-12 grid grid-cols-1 border-t sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <MotionStaggerItem key={s.href}>
              <Link
                href={s.href}
                className="border-ink/10 hover:bg-bone/40 group flex items-end justify-between gap-6 border-b border-l-0 px-1 py-10 transition-colors sm:px-6 lg:[&:not(:nth-child(3n+1))]:border-l lg:[&:not(:nth-child(3n+1))]:px-6 lg:[&:nth-child(3n+1)]:border-l-0 lg:[&:nth-child(3n+1)]:pl-1 lg:[&:nth-child(3n+1)]:pr-6"
              >
                <div>
                  <p className="text-ink/50 text-[10px] uppercase tracking-[0.22em]">{s.hint}</p>
                  <p className="mt-3 font-display text-3xl sm:text-4xl">{s.label}</p>
                </div>
                <span className="text-ink/40 shrink-0 text-[11px] uppercase tracking-[0.22em] transition-colors group-hover:text-ink">
                  →
                </span>
              </Link>
            </MotionStaggerItem>
          ))}
        </MotionStagger>
      </Container>
    </Section>
  );
}
