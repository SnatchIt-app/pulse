import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { buildFaqPageJsonLd, buildLodgingBusinessJsonLd, buildServiceJsonLd } from "@/lib/schema";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import MotionFade from "@/components/shared/MotionFade";
import ResidenceCard from "@/components/marketing/ResidenceCard";
import PublishedAssetCard from "@/components/marketing/PublishedAssetCard";
import { MotionStagger, MotionStaggerItem } from "@/components/shared/MotionStagger";
import FaqBlock from "@/components/marketing/FaqBlock";
import { residences } from "@/data/inventory/residences";
import { SERVICE_FAQS } from "@/data/faqs";
import {
  dedupeAgainstFlatFile,
  getPublishedAssetsByService,
} from "@/lib/inventory/published-assets";

export const metadata: Metadata = buildMetadata({ route: "/residences", path: "/residences" });

export const dynamic = "force-dynamic";
export const revalidate = 0;

const jsonLd = [
  buildLodgingBusinessJsonLd(),
  buildServiceJsonLd({
    name: "Pulse Residences",
    description: "Curated luxury homes and private stays in Miami.",
    path: "/residences",
  }),
  buildFaqPageJsonLd(SERVICE_FAQS.residences),
];

type ResidenceItem = (typeof residences)[number];
type MergedResidence =
  | {
      kind: "flatfile";
      key: string;
      data: ResidenceItem;
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

export default async function ResidencesPage() {
  const published = dedupeAgainstFlatFile(
    await getPublishedAssetsByService("residence"),
    residences.map((r) => r.slug),
  );

  const merged: MergedResidence[] = [
    ...residences.map<MergedResidence>((r) => ({
      kind: "flatfile",
      key: `f-${r.slug}`,
      data: r,
      featured: false,
      sortOrder: 0,
      name: r.title,
    })),
    ...published.map<MergedResidence>((p) => ({
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
      <Section className="bg-paper pb-4 pt-28 md:pb-6 md:pt-32">
        <Container>
          <MotionFade>
            <p className="text-ink/55 text-[11px] uppercase tracking-[0.24em]">Pulse Residences</p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[0.98] sm:text-6xl md:text-7xl">
              Luxury homes in Miami.
            </h1>
          </MotionFade>
          <MotionFade delay={0.08}>
            <p className="text-ink/65 mt-5 max-w-3xl text-sm leading-relaxed sm:text-base">
              Pulse curates a private selection of luxury homes across Miami — South Beach, the
              Design District, Buena Vista, and beyond. Every booking is by request. Contact a
              specialist to arrange.
            </p>
          </MotionFade>
        </Container>
      </Section>

      <Section className="bg-paper pb-24 pt-6 md:pb-32 md:pt-8">
        <Container>
          <MotionStagger className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {merged.map((item) => (
              <MotionStaggerItem key={item.key}>
                {item.kind === "flatfile" ? (
                  <ResidenceCard residence={item.data} />
                ) : (
                  <PublishedAssetCard asset={item.data} />
                )}
              </MotionStaggerItem>
            ))}
          </MotionStagger>
        </Container>
      </Section>

      <FaqBlock items={SERVICE_FAQS.residences} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
