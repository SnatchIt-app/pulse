import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import MotionFade from "@/components/shared/MotionFade";
import FaqBlock from "@/components/marketing/FaqBlock";
import EntityOpener from "@/components/marketing/EntityOpener";
import { buildFaqPageJsonLd, buildServiceJsonLd } from "@/lib/schema";
import { SERVICE_FAQS } from "@/data/faqs";

export const metadata: Metadata = buildMetadata({ route: "/concierge", path: "/concierge" });

const jsonLd = [
  buildServiceJsonLd({
    name: "Pulse Concierge",
    description: "Discreet, on-call luxury concierge in Miami.",
    path: "/concierge",
  }),
  buildFaqPageJsonLd(SERVICE_FAQS.concierge),
];

export default function ConciergePage() {
  return (
    <>
      <Section className="bg-paper pt-32">
        <Container>
          <MotionFade>
            <p className="text-ink/55 text-[11px] uppercase tracking-[0.24em]">Pulse Concierge</p>
            <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[0.98] sm:text-6xl md:text-7xl">
              Tell us what you want.
            </h1>
          </MotionFade>
        </Container>
      </Section>
      <EntityOpener body="Pulse runs a discreet, on-call concierge across Miami. Cars, jets, yachts, residences, restaurants, nightlife, events, bespoke requests — one quiet line." />
      <FaqBlock items={SERVICE_FAQS.concierge} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
