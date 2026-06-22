import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import MotionFade from "@/components/shared/MotionFade";
import CarCard from "@/components/marketing/CarCard";
import PublishedAssetCard from "@/components/marketing/PublishedAssetCard";
import { MotionStagger, MotionStaggerItem } from "@/components/shared/MotionStagger";
import { cars } from "@/data/inventory/cars";
import {
  dedupeAgainstFlatFile,
  getPublishedAssetsByService,
} from "@/lib/inventory/published-assets";

export const metadata: Metadata = buildMetadata({ route: "/fleet", path: "/fleet" });

// Server-render on every request so toggling Publish in the CRM reflects
// immediately on the public listing.
export const dynamic = "force-dynamic";
export const revalidate = 0;

type CarItem = (typeof cars)[number];
type MergedCar =
  | {
      kind: "flatfile";
      key: string;
      data: CarItem;
      featured: boolean;
      sortOrder: number;
      name: string;
    }
  | {
      kind: "published";
      key: string;
      data: Awaited<ReturnType<typeof getPublishedAssetsByService>>[number];
      featured: boolean;
      sortOrder: number;
      name: string;
    };

export default async function FleetPage() {
  const published = dedupeAgainstFlatFile(
    await getPublishedAssetsByService("car"),
    cars.map((c) => c.slug),
  );

  // Merge flat-file inventory + CRM-published assets, then sort the combined
  // dataset by featured DESC, public_sort_order ASC, name ASC.
  const merged: MergedCar[] = [
    ...cars.map<MergedCar>((c) => ({
      kind: "flatfile",
      key: `f-${c.slug}`,
      data: c,
      featured: false,
      sortOrder: 0,
      name: `${c.make} ${c.model}`,
    })),
    ...published.map<MergedCar>((p) => ({
      kind: "published",
      key: `p-${p.id}`,
      data: p,
      featured: p.public_featured,
      sortOrder: p.public_sort_order,
      name: p.name,
    })),
  ].sort((a, b) => {
    const f = Number(b.featured) - Number(a.featured);
    if (f !== 0) return f;
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.name.localeCompare(b.name);
  });
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
              Pulse keeps Miami&apos;s most sought-after exotic and luxury vehicles: Lamborghini,
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
            {merged.map((item) => (
              <MotionStaggerItem key={item.key}>
                {item.kind === "flatfile" ? (
                  <CarCard car={item.data} />
                ) : (
                  <PublishedAssetCard asset={item.data} />
                )}
              </MotionStaggerItem>
            ))}
          </MotionStagger>
        </Container>
      </Section>
    </>
  );
}
