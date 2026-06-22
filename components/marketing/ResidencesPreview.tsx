import Link from "next/link";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import { MotionStagger, MotionStaggerItem } from "@/components/shared/MotionStagger";
import ResidenceCard from "./ResidenceCard";
import { RESIDENCES_PREVIEW } from "@/data/residences-preview";

// Secondary tier on the homepage — cars stay primary. Smaller eyebrow,
// less visual real estate than FeaturedFleet.
export default function ResidencesPreview() {
  return (
    <Section className="bg-bone/30">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-ink/55 text-[11px] uppercase tracking-[0.24em]">Pulse Residences</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl leading-[1.05] sm:text-4xl md:text-5xl">
              Luxury homes, on the same line.
            </h2>
          </div>
          <Link
            href="/residences"
            className="text-ink/80 shrink-0 text-[11px] uppercase tracking-[0.22em] underline underline-offset-8 hover:text-ink"
          >
            Explore Pulse Residences →
          </Link>
        </div>
        <MotionStagger className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {RESIDENCES_PREVIEW.map((r) => (
            <MotionStaggerItem key={r.slug}>
              <ResidenceCard residence={r} />
            </MotionStaggerItem>
          ))}
        </MotionStagger>
      </Container>
    </Section>
  );
}
