import Link from "next/link";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import { MotionStagger, MotionStaggerItem } from "@/components/shared/MotionStagger";
import VehicleCard from "./VehicleCard";
import { FLEET_PREVIEW } from "@/data/fleet-preview";

export default function FeaturedFleet() {
  return (
    <Section className="bg-paper">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-ink/55 text-[11px] uppercase tracking-[0.24em]">The Fleet</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl leading-[1.02] sm:text-5xl md:text-6xl">
              Exotic and supercars, ready in Miami.
            </h2>
          </div>
          <Link
            href="/fleet"
            className="text-ink/80 shrink-0 text-[11px] uppercase tracking-[0.22em] underline underline-offset-8 hover:text-ink"
          >
            View the full fleet →
          </Link>
        </div>
        <MotionStagger className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {FLEET_PREVIEW.map((v) => (
            <MotionStaggerItem key={v.slug}>
              <VehicleCard vehicle={v} />
            </MotionStaggerItem>
          ))}
        </MotionStagger>
      </Container>
    </Section>
  );
}
