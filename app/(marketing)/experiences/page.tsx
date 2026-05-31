import type { Metadata } from "next";
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
  route: "/experiences",
  path: "/experiences",
  description:
    "Pulse arranges multi-service luxury experiences in Miami — exotic cars, private jets, yachts, residences, dining, and concierge. Supercar weekends, yacht days, Art Basel, F1, and bespoke occasions.",
});

// ─── Data ─────────────────────────────────────────────────────────────────────

const EXPERIENCES = [
  {
    slug: "supercar-weekend",
    title: "Supercar Weekend",
    services: "Cars · Chauffeur · Residences",
    body: "A Lamborghini or Rolls-Royce for the weekend. A private residence. Airport pickup in a blacked-out SUV. Every detail handled.",
  },
  {
    slug: "yacht-day",
    title: "Yacht Day",
    services: "Yachts · Provisioning · Transport",
    body: "A private yacht from Miami&rsquo;s finest marinas. Captain and crew. Open water, watersports, and catering — however you want the day to run.",
  },
  {
    slug: "jet-residence-stay",
    title: "Jet + Residence Stay",
    services: "Jets · Residences · Chauffeur",
    body: "Fly private into Miami, step into a curated luxury home, and have a vehicle waiting. Seamless from wheels-up to check-in.",
  },
  {
    slug: "birthday-experience",
    title: "Birthday Experience",
    services: "Cars · Yachts · Nightlife · Dining",
    body: "A fully arranged celebration — exotic car, yacht afternoon, restaurant reservation, and VIP nightlife access. The occasion handled, start to finish.",
  },
  {
    slug: "bachelor-bachelorette",
    title: "Bachelor & Bachelorette",
    services: "Yachts · Clubs · Cars · Dining",
    body: "Group-ready. A private yacht for the afternoon, dinner at the right tables, and bottle service at night. Pulse handles the full itinerary.",
  },
  {
    slug: "art-basel-experience",
    title: "Art Basel",
    services: "Jets · Residences · Dining · Events",
    body: "Private jet access, a Design District home, reservations at the right tables, and Pulse concierge on call through the week.",
  },
  {
    slug: "f1-miami-experience",
    title: "F1 Miami",
    services: "Cars · Hospitality · Dining · Residences",
    body: "An exotic car to arrive in. Curated dining before the race. A private residence steps from the action. Pulse builds the weekend around the circuit.",
  },
  {
    slug: "ultra-experience",
    title: "Ultra Experience",
    services: "Jets · Yachts · Cars · Residences · Concierge",
    body: "Private jet. A 72-foot yacht. Exotic car on arrival. Luxury villa. Pulse concierge on call. Everything arranged. Nothing left to manage.",
  },
] as const;

const PROCESS = [
  {
    step: "01",
    title: "Submit your vision",
    body: "Share your dates, occasion, headcount, and any preferences. Pulse works from a blank canvas — no packages, no constraints.",
  },
  {
    step: "02",
    title: "Your specialist responds",
    body: "A Pulse specialist replies within 15 minutes with a tailored arrangement — services, logistics, and options to refine.",
  },
  {
    step: "03",
    title: "Everything arranged",
    body: "One specialist. One quiet line. Cars, jets, yachts, residences, dining — all coordinated under a single point of contact.",
  },
] as const;

// JSON-LD: Service + FAQPage
const jsonLd = [
  buildServiceJsonLd({
    name: "Pulse Experiences",
    description:
      "Multi-service luxury experiences in Miami — exotic cars, private jets, yacht charters, luxury residences, and concierge arranged as a single seamless package.",
    path: "/experiences",
  }),
  buildFaqPageJsonLd(SERVICE_FAQS.experiences),
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ExperiencesPage() {
  return (
    <>
      {/* ── 1. Hero ─────────────────────────────────────────────────────────── */}
      <Section className="bg-paper pb-10 pt-32 md:pb-16 md:pt-44">
        <Container>
          <MotionFade>
            <p className="text-ink/55 text-[11px] uppercase tracking-[0.24em]">Pulse Experiences</p>
            <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[0.96] sm:text-6xl md:text-7xl lg:text-8xl">
              Miami&apos;s most complete luxury weekend.
            </h1>
          </MotionFade>
          <MotionFade delay={0.07}>
            <p className="text-ink/65 mt-7 max-w-xl text-base leading-relaxed sm:text-lg">
              Pulse arranges the entire picture — cars, jets, yachts, residences, dining, and
              nightlife — as a single seamless experience. Submit the occasion. We handle the rest.
            </p>
            <div className="mt-10">
              <Link
                href="/request?service=concierge"
                className="inline-flex items-center justify-center border border-ink px-8 py-4 text-[11px] uppercase tracking-[0.22em] transition-colors duration-pulse ease-pulse hover:bg-ink hover:text-paper"
              >
                Arrange an Experience
              </Link>
            </div>
          </MotionFade>
        </Container>
      </Section>

      {/* ── 2. Intro statement ──────────────────────────────────────────────── */}
      <Section className="bg-paper py-16 md:py-24">
        <Container>
          <MotionFade>
            <p className="text-ink/80 max-w-3xl font-display text-2xl leading-snug sm:text-3xl md:text-4xl">
              Most luxury operators do one thing. Pulse does everything — as a single arrangement,
              with one specialist, from your first message to your last night.
            </p>
          </MotionFade>
        </Container>
      </Section>

      {/* ── 3. Experience grid ──────────────────────────────────────────────── */}
      <Section className="bg-paper pb-28 pt-4 md:pb-36 md:pt-6">
        <Container>
          <MotionFade>
            <p className="text-ink/55 text-[11px] uppercase tracking-[0.24em]">
              What Pulse arranges
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-3xl leading-[1.05] sm:text-4xl md:text-5xl">
              Eight signature experiences.
            </h2>
          </MotionFade>

          <MotionStagger className="mt-14 grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
            {EXPERIENCES.map((exp) => (
              <MotionStaggerItem key={exp.slug}>
                <div className="border-brass/50 border-t pb-10 pt-8">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-brass">
                    {exp.services}
                  </p>
                  <h3 className="mt-4 font-display text-2xl leading-snug">{exp.title}</h3>
                  <p
                    className="text-ink/65 mt-4 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: exp.body }}
                  />
                  <Link
                    href={`/request?service=concierge&experience=${exp.slug}`}
                    className="text-ink/40 mt-5 inline-block text-[10px] uppercase tracking-[0.22em] transition-opacity hover:text-ink"
                    aria-label={`Inquire about ${exp.title}`}
                  >
                    Inquire →
                  </Link>
                </div>
              </MotionStaggerItem>
            ))}
          </MotionStagger>
        </Container>
      </Section>

      {/* ── 4. How Pulse arranges it ────────────────────────────────────────── */}
      <Section className="bg-ink text-paper">
        <Container>
          <MotionFade>
            <p className="text-paper/55 text-[11px] uppercase tracking-[0.24em]">The process</p>
            <h2 className="mt-5 max-w-3xl font-display text-4xl leading-[1.02] sm:text-5xl">
              One line. Everything arranged.
            </h2>
          </MotionFade>

          <MotionStagger className="mt-14 grid grid-cols-1 md:grid-cols-3">
            {PROCESS.map((step) => (
              <MotionStaggerItem key={step.step}>
                <div className="border-paper/15 border-t py-10 md:py-12 md:pr-12">
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
                href="/request?service=concierge"
                className="inline-flex items-center justify-center bg-paper px-8 py-4 text-[11px] uppercase tracking-[0.22em] text-ink transition-colors duration-pulse ease-pulse hover:bg-bone"
              >
                Start Your Request
              </Link>
            </div>
          </MotionFade>
        </Container>
      </Section>

      {/* ── 5. FAQ ──────────────────────────────────────────────────────────── */}
      <FaqBlock
        items={SERVICE_FAQS.experiences}
        heading="Common questions about Pulse Experiences"
      />

      {/* ── 6. CTA ──────────────────────────────────────────────────────────── */}
      <Section className="bg-paper pb-32 pt-0 md:pb-44">
        <Container>
          <MotionFade>
            <div className="border-ink/10 border-t pt-16 md:pt-24">
              <p className="text-ink/55 text-[11px] uppercase tracking-[0.24em]">
                Tell us what you&apos;re planning
              </p>
              <h2 className="mt-5 max-w-2xl font-display text-4xl leading-[1.0] sm:text-5xl md:text-6xl">
                Your occasion. Our concierge.
              </h2>
              <p className="text-ink/60 mt-6 max-w-md text-sm leading-relaxed">
                Every Pulse experience is built from scratch. Submit your request and a specialist
                responds within 15 minutes — direct, personal, and without delay.
              </p>
              <Link
                href="/request?service=concierge"
                className="mt-10 inline-flex items-center justify-center bg-ink px-8 py-4 text-[11px] uppercase tracking-[0.22em] text-paper transition-colors duration-pulse ease-pulse hover:bg-graphite"
              >
                Arrange an Experience
              </Link>
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
