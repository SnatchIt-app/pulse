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

type JetItem = (typeof jets)[number];
type MergedJet =
  | {
      kind: "flatfile";
      key: string;
      data: JetItem;
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

export default async function JetsPage() {
  const published = dedupeAgainstFlatFile(
    await getPublishedAssetsByService("jet"),
    jets.map((j) => j.slug),
  );

  const merged: MergedJet[] = [
    ...jets.map<MergedJet>((j) => ({
      kind: "flatfile",
      key: `f-${j.slug}`,
      data: j,
      featured: false,
      sortOrder: 0,
      name: j.name,
    })),
    ...published.map<MergedJet>((p) => ({
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
      {/* Hero */}
      <Section className="bg-paper pb-4 pt-28 md:pb-6 md:pt-32">
        <Container>
          <MotionFade>
            <p className="text-ink/55 text-[11px] uppercase tracking-[0.24em]">The Fleet · Jets</p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[0.98] sm:text-6xl md:text-7xl">
              Private jet charter from Miami.
            </h1>
          </MotionFade>
          <MotionFade delay={0.08}>
            <p className="text-ink/65 mt-5 max-w-3xl text-sm leading-relaxed sm:text-base">
              Pulse arranges private jet charters from Miami across the U.S., the Caribbean, and
              Latin America. Midsize to heavy cabin, booked, briefed, and on the ramp inside hours.
            </p>
          </MotionFade>
        </Container>
      </Section>

      {/* Grid */}
      <Section className="bg-paper pb-24 pt-6 md:pb-32 md:pt-8">
        <Container>
          <MotionStagger className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {merged.map((item) => (
              <MotionStaggerItem key={item.key}>
                {item.kind === "flatfile" ? (
                  <JetCard jet={item.data} />
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
