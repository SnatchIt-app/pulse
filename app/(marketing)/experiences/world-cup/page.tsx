import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { buildFaqPageJsonLd, buildServiceJsonLd } from "@/lib/schema";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import MotionFade from "@/components/shared/MotionFade";
import { MotionStagger, MotionStaggerItem } from "@/components/shared/MotionStagger";
import FaqBlock from "@/components/marketing/FaqBlock";
import { SERVICE_FAQS } from "@/data/faqs";

export const metadata: Metadata = buildMetadata({
  title: "World Cup Experiences",
  path: "/experiences/world-cup",
  description:
    "Curated FIFA World Cup 26™ matchday experiences by Pulse, including ticket access requests, chauffeur, exotic cars, jets, residences, dining, nightlife, and concierge support.",
  keywords: [
    "World Cup 26 experiences",
    "World Cup matchday concierge",
    "World Cup ticket access Miami",
    "luxury World Cup experience",
    "World Cup VIP concierge",
  ],
});

const DISCLAIMER = "Pulse is an independent concierge provider and is not affiliated with FIFA.";

// ─── Data ─────────────────────────────────────────────────────────────────────

const ARRANGE = [
  {
    label: "Access",
    title: "Match tickets & access sourcing",
    body: "Matchday tickets and access sourced through our network — best-efforts, subject to availability. Tell us the fixture and we&rsquo;ll confirm what&rsquo;s possible.",
  },
  {
    label: "Arrival",
    title: "Chauffeur",
    body: "Discreet black-car arrival and departure on both ends — to the stadium, the hotel, and everywhere the week takes you.",
  },
  {
    label: "Drive",
    title: "Exotic car rental",
    body: "A Lamborghini, Ferrari, or Rolls-Royce for match week. Delivered, fueled, and waiting when you land.",
  },
  {
    label: "Air",
    title: "Private jet coordination",
    body: "Fly private between host cities or in for a single fixture. Aircraft matched to route, group, and schedule.",
  },
  {
    label: "Stay",
    title: "Yacht & residence options",
    body: "A private yacht for the afternoon or a curated residence for the week — placed where you want to be.",
  },
  {
    label: "Table",
    title: "Restaurant & nightlife reservations",
    body: "The right tables before the match and access to the room after. Dining and nightlife handled across the city.",
  },
] as const;

const STEPS = [
  {
    step: "01",
    title: "Choose your match or city",
    body: "Tell us the fixture, the host city, or simply the dates you want to be there.",
  },
  {
    step: "02",
    title: "Submit your request",
    body: "Share headcount, preferences, and the services you want around the match. One short form.",
  },
  {
    step: "03",
    title: "Pulse curates the experience",
    body: "A specialist sources access and builds the surrounding week — cars, jets, stays, and tables.",
  },
  {
    step: "04",
    title: "Arrive fully handled",
    body: "Step off the plane into a finished itinerary. One quiet line for anything that comes up.",
  },
] as const;

// JSON-LD: Service + FAQPage
const jsonLd = [
  buildServiceJsonLd({
    name: "Pulse World Cup Experiences",
    description:
      "Curated FIFA World Cup 26™ matchday experiences by Pulse — ticket access requests, chauffeur, exotic cars, private jets, yachts, residences, dining, nightlife, and concierge support. Independent concierge provider, not affiliated with FIFA.",
    path: "/experiences/world-cup",
  }),
  buildFaqPageJsonLd(SERVICE_FAQS["world-cup"]),
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WorldCupPage() {
  return (
    <>
      {/* ── 1. Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative isolate min-h-[90vh] overflow-hidden bg-ink text-paper">
        <Image
          src="/world-cup/hero.svg"
          alt="Stadium floodlights over a darkened pitch, rendered in Pulse black and gold."
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-80"
        />
        <div className="from-ink/85 via-ink/40 to-ink/90 absolute inset-0 bg-gradient-to-b" />
        <Container className="relative flex min-h-[90vh] flex-col justify-end pb-20 pt-40 md:pb-28">
          <MotionFade>
            <p className="text-[11px] uppercase tracking-[0.28em] text-brass">
              Pulse · World Cup 26™ Experiences
            </p>
            <h1 className="mt-6 max-w-5xl font-display text-5xl leading-[0.96] sm:text-7xl md:text-[clamp(60px,7.5vw,120px)]">
              The match is the moment. The week is ours.
            </h1>
            <p className="text-paper/80 mt-8 max-w-xl text-base sm:text-lg">
              Pulse is now offering curated FIFA World Cup 26™ experiences. Request access at least
              one week before any match.
            </p>
            <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/request?service=experience&experience=world-cup"
                className="inline-flex items-center justify-center bg-brass px-7 py-4 text-[11px] uppercase tracking-[0.22em] text-ink transition-opacity duration-pulse ease-pulse hover:opacity-90"
              >
                Request World Cup Access
              </Link>
              <Link
                href="/request?service=experience&experience=world-cup-match-week"
                className="border-paper/60 inline-flex items-center justify-center border px-7 py-4 text-[11px] uppercase tracking-[0.22em] text-paper transition-colors duration-pulse ease-pulse hover:bg-paper hover:text-ink"
              >
                Plan My Match Week
              </Link>
            </div>
            <p className="text-paper/40 mt-10 max-w-md text-[11px] leading-relaxed tracking-[0.04em]">
              {DISCLAIMER}
            </p>
          </MotionFade>
        </Container>
      </section>

      {/* ── 2. Intro statement ──────────────────────────────────────────────── */}
      <Section className="bg-paper py-16 md:py-24">
        <Container>
          <MotionFade>
            <p className="text-ink/55 text-[11px] uppercase tracking-[0.24em]">
              World Cup experience access
            </p>
            <p className="text-ink/80 mt-6 max-w-3xl font-display text-2xl leading-snug sm:text-3xl md:text-4xl">
              A curated matchday experience is more than a ticket. Pulse arranges the access, the
              arrival, and everything around the ninety minutes — sourced through our network and
              subject to availability.
            </p>
          </MotionFade>
        </Container>
      </Section>

      {/* ── 3. What Pulse can arrange ───────────────────────────────────────── */}
      <Section className="bg-paper pb-28 pt-4 md:pb-36 md:pt-6">
        <Container>
          <MotionFade>
            <p className="text-ink/55 text-[11px] uppercase tracking-[0.24em]">
              What Pulse can arrange
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-3xl leading-[1.05] sm:text-4xl md:text-5xl">
              One specialist. The full matchday.
            </h2>
          </MotionFade>

          <MotionStagger className="mt-14 grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {ARRANGE.map((item) => (
              <MotionStaggerItem key={item.title}>
                <div className="border-brass/50 border-t pb-10 pt-8">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-brass">{item.label}</p>
                  <h3 className="mt-4 font-display text-2xl leading-snug">{item.title}</h3>
                  <p
                    className="text-ink/65 mt-4 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.body }}
                  />
                </div>
              </MotionStaggerItem>
            ))}
          </MotionStagger>
        </Container>
      </Section>

      {/* ── 4. How it works ─────────────────────────────────────────────────── */}
      <Section className="bg-ink text-paper">
        <Container>
          <MotionFade>
            <p className="text-paper/55 text-[11px] uppercase tracking-[0.24em]">How it works</p>
            <h2 className="mt-5 max-w-3xl font-display text-4xl leading-[1.02] sm:text-5xl">
              Four steps to a finished week.
            </h2>
          </MotionFade>

          <MotionStagger className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <MotionStaggerItem key={step.step}>
                <div className="border-paper/15 border-t py-10 md:py-12 md:pr-10">
                  <p className="text-paper/25 font-display text-5xl leading-none">{step.step}</p>
                  <h3 className="mt-6 font-display text-xl text-paper sm:text-2xl">{step.title}</h3>
                  <p className="text-paper/60 mt-4 text-sm leading-relaxed">{step.body}</p>
                </div>
              </MotionStaggerItem>
            ))}
          </MotionStagger>

          <MotionFade delay={0.1}>
            <div className="border-paper/10 mt-12 border-t pt-12">
              <Link
                href="/request?service=experience&experience=world-cup"
                className="inline-flex items-center justify-center bg-brass px-8 py-4 text-[11px] uppercase tracking-[0.22em] text-ink transition-opacity duration-pulse ease-pulse hover:opacity-90"
              >
                Request World Cup Access
              </Link>
            </div>
          </MotionFade>
        </Container>
      </Section>

      {/* ── 5. Host city / match week luxury angle ──────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-ink text-paper">
        <div className="relative aspect-[16/10] w-full md:aspect-[16/7]">
          <Image
            src="/world-cup/match-week.svg"
            alt="Floodlit stadium bowl at night under a gold horizon glow, in the Pulse palette."
            fill
            sizes="100vw"
            className="object-cover opacity-80"
          />
          <div className="from-ink/75 via-ink/25 to-ink/80 absolute inset-0 bg-gradient-to-r" />
        </div>
        <Container className="relative -mt-32 pb-24 md:-mt-48 md:pb-32">
          <MotionFade>
            <p className="text-[11px] uppercase tracking-[0.24em] text-brass">Match week, elevated</p>
            <h2 className="mt-6 max-w-3xl font-display text-3xl leading-[1.1] sm:text-5xl md:text-6xl">
              Arrive like the match was built around you.
            </h2>
            <p className="text-paper/70 mt-7 max-w-xl text-sm leading-relaxed sm:text-base">
              The host city fills, the calendar tightens, and the best of everything goes first.
              Pulse holds the line — the residence on the right street, the table after the final
              whistle, the car at the curb. You watch the football. We handle the city.
            </p>
          </MotionFade>
        </Container>
      </section>

      {/* ── 6. FAQ ──────────────────────────────────────────────────────────── */}
      <FaqBlock
        items={SERVICE_FAQS["world-cup"]}
        heading="Common questions about World Cup experiences"
      />

      {/* ── 7. Final CTA ────────────────────────────────────────────────────── */}
      <Section className="bg-paper pb-32 pt-0 md:pb-44">
        <Container>
          <MotionFade>
            <div className="border-ink/10 border-t pt-16 md:pt-24">
              <p className="text-ink/55 text-[11px] uppercase tracking-[0.24em]">
                Request access early
              </p>
              <h2 className="mt-5 max-w-2xl font-display text-4xl leading-[1.0] sm:text-5xl md:text-6xl">
                Your match. Fully handled.
              </h2>
              <p className="text-ink/60 mt-6 max-w-md text-sm leading-relaxed">
                Pulse is now offering curated FIFA World Cup 26™ experiences. Request access at least
                one week before any match — a specialist responds within 15 minutes.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="/request?service=experience&experience=world-cup"
                  className="inline-flex items-center justify-center bg-ink px-8 py-4 text-[11px] uppercase tracking-[0.22em] text-paper transition-colors duration-pulse ease-pulse hover:bg-graphite"
                >
                  Request World Cup Access
                </Link>
                <Link
                  href="/request?service=experience&experience=world-cup-match-week"
                  className="inline-flex items-center justify-center border border-ink px-8 py-4 text-[11px] uppercase tracking-[0.22em] transition-colors duration-pulse ease-pulse hover:bg-ink hover:text-paper"
                >
                  Plan My Match Week
                </Link>
              </div>
              <p className="text-ink/40 mt-10 max-w-md text-[11px] leading-relaxed tracking-[0.04em]">
                {DISCLAIMER}
              </p>
            </div>
          </MotionFade>
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
