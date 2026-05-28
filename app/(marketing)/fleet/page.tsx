import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import MotionFade from "@/components/shared/MotionFade";
import CarCard from "@/components/marketing/CarCard";
import { MotionStagger, MotionStaggerItem } from "@/components/shared/MotionStagger";
import { cars } from "@/data/inventory/cars";

export const metadata: Metadata = buildMetadata({ route: "/fleet", path: "/fleet" });

export default function FleetPage() {
  return (
    <>
      {/* Hero — tight bottom so the grid arrives quickly */}
      <Section className="bg-paper pb-4 pt-28 md:pb-6 md:pt-32">
        <Container>
          <MotionFade>
            <p className="text-ink/55 text-[11px] uppercase tracking-[0.24em]">The Fleet</p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[0.98] sm:text-6xl md:text-7xl">
              Exotic &amp; supercars in Miami.
            </h1>
          </MotionFade>
          <MotionFade delay={0.08}>
            <p className="text-ink/65 mt-5 max-w-3xl text-sm leading-relaxed sm:text-base">
              Pulse curates Miami&apos;s most sought-after exotic and luxury vehicles — Lamborghini,
              Rolls-Royce, McLaren, and Bentley. Every booking is by request. Contact a specialist
              to arrange.
            </p>
          </MotionFade>
        </Container>
      </Section>

      {/* Grid — minimal top gap, standard bottom */}
      <Section className="bg-paper pb-24 pt-6 md:pb-32 md:pt-8">
        <Container>
          <MotionStagger className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {cars.map((car) => (
              <MotionStaggerItem key={car.slug}>
                <CarCard car={car} />
              </MotionStaggerItem>
            ))}
          </MotionStagger>
        </Container>
      </Section>
    </>
  );
}
