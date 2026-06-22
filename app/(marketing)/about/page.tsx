import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import MotionFade from "@/components/shared/MotionFade";
import { MotionStagger, MotionStaggerItem } from "@/components/shared/MotionStagger";

export const metadata: Metadata = buildMetadata({ route: "/about", path: "/about" });

const SERVICES = [
  {
    label: "Exotic Cars",
    body: "Lamborghini, Rolls-Royce, McLaren, Bentley: the most sought-after vehicles in Miami, arranged by request. Delivered to your hotel, marina, or residence.",
  },
  {
    label: "Private Jets",
    body: "Charter flights for any itinerary, domestic or international. Light jets, midsize, heavy, configured around your schedule and party size.",
  },
  {
    label: "Yacht Charters",
    body: "Private yacht charters across Biscayne Bay and beyond. From half-day escapes to multi-day itineraries, captained and provisioned.",
  },
  {
    label: "Luxury Residences",
    body: "A private inventory of homes across South Beach, the Design District, Buena Vista, and Miami's most sought-after neighborhoods. Verified, vetted, and arranged by Pulse.",
  },
  {
    label: "Concierge",
    body: "Restaurant reservations, nightlife access, VIP events, jet skis, chauffeur service, and anything else Miami has to offer. One contact. Everything handled.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <Section className="bg-paper pb-10 pt-32 md:pb-14 md:pt-40">
        <Container>
          <MotionFade>
            <p className="text-ink/55 text-[11px] uppercase tracking-[0.24em]">About Pulse</p>
            <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[0.96] sm:text-6xl md:text-7xl lg:text-8xl">
              Miami&apos;s concierge for the exceptional.
            </h1>
          </MotionFade>
        </Container>
      </Section>

      {/* What Pulse is */}
      <Section className="bg-paper pb-16 pt-8 md:pb-24">
        <Container>
          <MotionFade delay={0.05}>
            <div className="max-w-2xl">
              <p className="text-ink/75 text-lg leading-relaxed sm:text-xl">
                Pulse is a private concierge built for one city. We arrange exotic cars, private
                jets, yacht charters, luxury residences, and custom experiences for clients who
                expect more than off-the-shelf bookings.
              </p>
              <p className="text-ink/55 mt-6 text-base leading-relaxed">
                Everything is by request. Submit what you need and a specialist responds within 15
                minutes. Availability confirmed, quote in hand, ready to move.
              </p>
            </div>
          </MotionFade>
        </Container>
      </Section>

      {/* Services */}
      <Section className="border-ink/10 bg-bone/30 border-y py-20 md:py-28">
        <Container>
          <MotionFade>
            <p className="text-ink/40 text-[10px] uppercase tracking-[0.26em]">What we arrange</p>
          </MotionFade>
          <MotionStagger className="border-ink/10 bg-ink/10 mt-10 grid grid-cols-1 gap-px border sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <MotionStaggerItem key={s.label}>
                <div className="bg-paper px-8 py-10">
                  <p className="font-display text-xl">{s.label}</p>
                  <p className="text-ink/60 mt-3 text-sm leading-relaxed">{s.body}</p>
                </div>
              </MotionStaggerItem>
            ))}
          </MotionStagger>
        </Container>
      </Section>

      {/* How it works */}
      <Section className="bg-paper py-20 md:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
            <MotionFade>
              <p className="text-ink/40 text-[10px] uppercase tracking-[0.26em]">How it works</p>
              <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">
                One request. Everything arranged.
              </h2>
            </MotionFade>
            <MotionFade delay={0.06}>
              <ol className="space-y-8">
                {[
                  {
                    n: "01",
                    heading: "Submit a request",
                    body: "Tell us what you need: vehicle, dates, locations, group size. Takes under two minutes.",
                  },
                  {
                    n: "02",
                    heading: "Specialist responds",
                    body: "A Pulse specialist confirms availability and sends your quote within 15 minutes.",
                  },
                  {
                    n: "03",
                    heading: "Confirmed and delivered",
                    body: "Once approved, your booking is locked. We handle logistics end to end.",
                  },
                ].map((step) => (
                  <li key={step.n} className="flex gap-6">
                    <span className="text-ink/25 w-8 shrink-0 font-display text-sm">{step.n}</span>
                    <div>
                      <p className="font-display text-lg">{step.heading}</p>
                      <p className="text-ink/55 mt-1.5 text-sm leading-relaxed">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </MotionFade>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="bg-ink py-20 md:py-28">
        <Container>
          <MotionFade>
            <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-paper/40 text-[10px] uppercase tracking-[0.24em]">
                  Ready to book
                </p>
                <h2 className="mt-4 max-w-lg font-display text-3xl text-paper sm:text-4xl">
                  Tell us what you need and we handle the rest.
                </h2>
              </div>
              <Link
                href="/request"
                className="shrink-0 bg-paper px-8 py-4 text-[11px] uppercase tracking-[0.22em] text-ink transition-colors duration-[480ms] hover:bg-bone"
              >
                Start a Request →
              </Link>
            </div>
          </MotionFade>
        </Container>
      </Section>
    </>
  );
}
