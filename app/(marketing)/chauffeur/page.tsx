import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { buildServiceJsonLd } from "@/lib/schema";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";

export const metadata: Metadata = buildMetadata({ route: "/chauffeur", path: "/chauffeur" });

const jsonLd = buildServiceJsonLd({
  name: "Private Chauffeur Service in Miami",
  description: "Discreet, professional chauffeur service across Miami via Pulse.",
  path: "/chauffeur",
});

export default function ChauffeurPage() {
  return (
    <Section className="pt-32">
      <Container>
        <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Pulse Chauffeur</p>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">Private chauffeur in Miami.</h1>
      </Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Section>
  );
}
