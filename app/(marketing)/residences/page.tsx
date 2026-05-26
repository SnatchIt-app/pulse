import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { buildFaqPageJsonLd, buildLodgingBusinessJsonLd, buildServiceJsonLd } from "@/lib/schema";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";

export const metadata: Metadata = buildMetadata({ route: "/residences", path: "/residences" });

// Public, vendor-free FAQ. Final copy lands later; structure ships now.
const faqs = [
  {
    q: "What is Pulse Residences?",
    a: "Pulse Residences is a curated selection of luxury homes and private stays across Miami.",
  },
  {
    q: "Where are Pulse Residences located?",
    a: "Across Miami, Miami Beach, Brickell, South Beach, Wynwood, the Design District, and Coral Gables.",
  },
  {
    q: "How do I book a Pulse Residence?",
    a: "Submit a request for the residence you'd like and a Pulse specialist replies within 15 minutes.",
  },
] as const;

const jsonLd = [
  buildLodgingBusinessJsonLd(),
  buildServiceJsonLd({
    name: "Pulse Residences",
    description: "Curated luxury homes and private stays in Miami.",
    path: "/residences",
  }),
  buildFaqPageJsonLd(faqs),
];

export default function ResidencesPage() {
  return (
    <Section className="pt-32">
      <Container>
        <p className="text-ink/60 text-xs uppercase tracking-[0.2em]">Pulse Residences</p>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">Curated luxury homes in Miami.</h1>
        <p className="text-ink/70 mt-8 max-w-xl text-lg">
          A curated collection of private residences across Miami&apos;s most desirable
          neighborhoods.
        </p>
        <p className="text-ink/60 mt-6 max-w-xl">Residence grid lands in Phase 3.5.</p>
      </Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Section>
  );
}
