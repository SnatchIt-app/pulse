import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import MotionFade from "@/components/shared/MotionFade";
import JetCard from "@/components/marketing/JetCard";
import PublishedAssetCard from "@/components/marketing/PublishedAssetCard";
import { MotionStagger, MotionStaggerItem } from "@/components/shared/MotionStagger";
import { jets } from "@/data/inventory/jets";
import {
  dedupeAgainstFlatFile,
  getPublishedAssetsByService,
} from "@/lib/inventory/published-assets";

export const metadata: Metadata = buildMetadata({ route: "/jets", path: "/jets" });

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function JetsPage() {
  const published = dedupeAgainstFlatFile(
    await getPublishedAssetsByService("jet"),
    jets.map((j) => j.slug),
  );
  return (
    <>
      {/* Hero */}
      <Section className="bg-paper pb-4 pt-28 md:pb-6 md:pt-32">
        <Container>
          <MotionFade>
            <p className="text-ink/55 text-[11px] uppercase tracking-[0.24em]">The Fleet — Jets</p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[0.98] sm:text-6xl md:text-7xl">
              Private jet charter from Miami.
            </h1>
          </MotionFade>
          <MotionFade delay={0.08}>
            <p className="text-ink/65 mt-5 max-w-3xl text-sm leading-relaxed sm:text-base">
              Pulse arranges private jet charters from Miami across the U.S., the Caribbean, and
              Latin America. Midsize to heavy cabin — booked, briefed, and on the ramp inside hours.
            </p>
          </MotionFade>
        </Container>
      </Section>

      {/* Grid */}
      <Section className="bg-paper pb-24 pt-6 md:pb-32 md:pt-8">
        <Container>
          <MotionStagger className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {jets.map((jet) => (
              <MotionStaggerItem key={jet.slug}>
                <JetCard jet={jet} />
              </MotionStaggerItem>
            ))}
            {published.map((asset) => (
              <MotionStaggerItem key={asset.id}>
                <PublishedAssetCard asset={asset} />
              </MotionStaggerItem>
            ))}
          </MotionStagger>
        </Container>
      </Section>
    </>
  );
}
