import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import MotionFade from "@/components/shared/MotionFade";
import YachtCard from "@/components/marketing/YachtCard";
import PublishedAssetCard from "@/components/marketing/PublishedAssetCard";
import { MotionStagger, MotionStaggerItem } from "@/components/shared/MotionStagger";
import { yachts } from "@/data/inventory/yachts";
import {
  dedupeAgainstFlatFile,
  getPublishedAssetsByService,
} from "@/lib/inventory/published-assets";

export const metadata: Metadata = buildMetadata({ route: "/yachts", path: "/yachts" });

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function YachtsPage() {
  const published = dedupeAgainstFlatFile(
    await getPublishedAssetsByService("yacht"),
    yachts.map((y) => y.slug),
  );
  return (
    <>
      {/* Hero — tight bottom so the grid arrives quickly */}
      <Section className="bg-paper pb-4 pt-28 md:pb-6 md:pt-32">
        <Container>
          <MotionFade>
            <p className="text-ink/55 text-[11px] uppercase tracking-[0.24em]">
              The Fleet — Yachts
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[0.98] sm:text-6xl md:text-7xl">
              Yacht charter in Miami.
            </h1>
          </MotionFade>
          <MotionFade delay={0.08}>
            <p className="text-ink/65 mt-5 max-w-3xl text-sm leading-relaxed sm:text-base">
              Pulse runs day, multi-day, and event charters from Miami&apos;s leading marinas.
              Curated fleet, vetted crews, watersports and chef-grade provisioning when you want
              them.
            </p>
          </MotionFade>
        </Container>
      </Section>

      {/* Grid — minimal top gap, standard bottom */}
      <Section className="bg-paper pb-24 pt-6 md:pb-32 md:pt-8">
        <Container>
          <MotionStagger className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {yachts.map((yacht) => (
              <MotionStaggerItem key={yacht.slug}>
                <YachtCard yacht={yacht} />
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
