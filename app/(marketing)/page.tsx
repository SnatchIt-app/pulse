import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";

export const metadata: Metadata = buildMetadata({ route: "/", path: "/" });

// Cars are primary in the hero + featured order. Residences appears in the
// secondary services rail only.
const services: ReadonlyArray<{ label: string; href: string }> = [
  { label: "The Fleet", href: "/fleet" },
  { label: "Jets", href: "/jets" },
  { label: "Yachts", href: "/yachts" },
  { label: "Jet Skis", href: "/jet-skis" },
  { label: "Chauffeur", href: "/chauffeur" },
  { label: "Residences", href: "/residences" },
  { label: "Restaurants", href: "/restaurants" },
  { label: "Nightlife", href: "/nightlife" },
  { label: "Concierge", href: "/concierge" },
];

export default function HomePage() {
  return (
    <>
      <Section className="pt-32">
        <Container>
          <p className="text-ink/60 text-xs uppercase tracking-[0.2em]">Pulse — Miami</p>
          <h1 className="mt-4 max-w-4xl font-display text-6xl leading-[0.95] sm:text-7xl md:text-8xl">
            Luxury mobility, on call.
          </h1>
          <p className="text-ink/70 mt-8 max-w-xl text-lg">
            Exotic cars first. Then jets, yachts, residences, and concierge access — Pulse runs the
            whole stay.
          </p>
          <div className="mt-10 flex gap-4">
            <Link
              href="/fleet"
              className="bg-ink px-7 py-3.5 text-xs uppercase tracking-[0.18em] text-paper transition-opacity hover:opacity-90"
            >
              View the Fleet
            </Link>
            <Link
              href="/request"
              className="border border-ink px-7 py-3.5 text-xs uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-paper"
            >
              Request Access
            </Link>
          </div>
        </Container>
      </Section>

      <Section className="py-16">
        <Container>
          <p className="text-ink/60 text-xs uppercase tracking-[0.2em]">Services</p>
          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3">
            {services.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="border-ink/10 block border-b py-4 font-display text-2xl transition-opacity hover:opacity-60"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
