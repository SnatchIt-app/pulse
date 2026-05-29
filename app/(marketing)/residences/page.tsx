import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { buildFaqPageJsonLd, buildLodgingBusinessJsonLd, buildServiceJsonLd } from "@/lib/schema";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import MotionFade from "@/components/shared/MotionFade";
import ResidenceCard from "@/components/marketing/ResidenceCard";
import { MotionStagger, MotionStaggerItem } from "@/components/shared/MotionStagger";
import FaqBlock from "@/components/marketing/FaqBlock";
import { residences } from "@/data/inventory/residences";
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

export default function ResidencesPage() {
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
            {residences.map((r) => (
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
