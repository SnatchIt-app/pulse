import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { buildFaqPageJsonLd, buildLodgingBusinessJsonLd, buildServiceJsonLd } from "@/lib/schema";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import MotionFade from "@/components/shared/MotionFade";
import EntityOpener from "@/components/marketing/EntityOpener";
import ResidenceCard from "@/components/marketing/ResidenceCard";
import { MotionStagger, MotionStaggerItem } from "@/components/shared/MotionStagger";
import FaqBlock from "@/components/marketing/FaqBlock";
import { RESIDENCES_PREVIEW } from "@/data/residences-preview";
import { SERVICE_FAQS } from "@/data/faqs";

export const metadata: Metadata = buildMetadata({ route: "/residences", path: "/residences" });

const jsonLd = [
  buildLodgingBusinessJsonLd(),
  buildServiceJsonLd({
    name: "Pulse Residences",
    description: "Curated luxury homes and private stays in Miami.",
    path: "/residences",
  }),
  buildFaqPageJsonLd(SERVICE_FAQS.residences),
];

// Real Supabase-backed grid lands in Phase 3.5; Phase 2 uses the homepage preview
// dataset so the page reads as real. Vendor/source fields are never present here.
export default function ResidencesPage() {
  return (
    <>
      <Section className="bg-paper pt-32">
        <Container>
          <MotionFade>
            <p className="text-ink/55 text-[11px] uppercase tracking-[0.24em]">Pulse Residences</p>
            <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[0.98] sm:text-6xl md:text-7xl">
              Curated luxury homes in Miami.
            </h1>
          </MotionFade>
        </Container>
      </Section>
      <EntityOpener body="Pulse Residences is a curated selection of luxury homes and private stays across Miami, Miami Beach, Brickell, South Beach, Wynwood, the Design District, and Coral Gables." />
      <Section className="bg-paper">
        <Container>
          <MotionStagger className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {RESIDENCES_PREVIEW.map((r) => (
              <MotionStaggerItem key={r.slug}>
                <ResidenceCard residence={r} />
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
