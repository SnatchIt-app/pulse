import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import MotionFade from "@/components/shared/MotionFade";

export const metadata: Metadata = buildMetadata({ route: "/request", path: "/request" });

type SearchParams = Promise<{
  vehicle?: string;
  title?: string;
  [key: string]: string | undefined;
}>;

export default async function RequestPage({ searchParams }: { searchParams: SearchParams }) {
  const { vehicle, title } = await searchParams;

  const vehicleTitle = title ? decodeURIComponent(title) : null;
  const hasVehicle = Boolean(vehicle && vehicleTitle);

  return (
    <Section className="bg-paper pt-32">
      <Container>
        <MotionFade>
          <p className="text-ink/55 text-[11px] uppercase tracking-[0.24em]">
            {hasVehicle ? "Vehicle Request" : "Request"}
          </p>

          <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[0.98] sm:text-6xl md:text-7xl">
            Tell us what you need.
          </h1>

          {/* Vehicle context chip — shown when arriving from a fleet detail page */}
          {hasVehicle && (
            <div className="border-ink/10 mt-8 inline-flex items-center gap-3 border bg-bone px-5 py-3">
              <span className="text-ink/40 text-[9px] uppercase tracking-[0.2em]">Vehicle</span>
              <span className="font-display text-base">{vehicleTitle}</span>
              <Link
                href={`/fleet/${vehicle}`}
                className="text-ink/35 ml-2 text-[9px] uppercase tracking-[0.18em] transition-colors hover:text-ink"
              >
                ← Change
              </Link>
            </div>
          )}

          <p className="text-ink/55 mt-8 max-w-xl text-sm leading-relaxed sm:text-base">
            {hasVehicle
              ? `A Pulse specialist will confirm availability for the ${vehicleTitle} and send a tailored quote within 15 minutes.`
              : "A Pulse specialist responds within 15 minutes. Exotic cars, yachts, jets, residences — anything inside a Miami stay."}
          </p>

          {/* Phase 4 form placeholder */}
          <div className="border-ink/10 mt-12 border-t pt-10">
            <p className="text-ink/35 text-[10px] uppercase tracking-[0.2em]">
              Request form — Phase 4
            </p>
            <p className="text-ink/45 mt-3 max-w-sm text-sm">In the meantime, reach us directly:</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-6">
              <a
                href="tel:+10000000000"
                className="text-ink/65 text-[11px] uppercase tracking-[0.22em] underline underline-offset-4 transition-colors duration-[480ms] hover:text-ink"
              >
                Call Pulse
              </a>
              <a
                href="mailto:hello@pulse.example.com"
                className="text-ink/65 text-[11px] uppercase tracking-[0.22em] underline underline-offset-4 transition-colors duration-[480ms] hover:text-ink"
              >
                Email Us
              </a>
            </div>
          </div>
        </MotionFade>
      </Container>
    </Section>
  );
}
