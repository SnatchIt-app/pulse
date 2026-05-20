import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { buildServiceJsonLd } from "@/lib/schema";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";

export const metadata: Metadata = buildMetadata({ route: "/jet-skis", path: "/jet-skis" });

const jsonLd = buildServiceJsonLd({
  name: "Jet Ski Rental in Miami",
  description: "Jet ski rentals across Miami and Miami Beach via Pulse.",
  path: "/jet-skis",
});

export default function JetSkisPage() {
  return (
    <Section className="pt-32">
      <Container>
        <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Pulse Jet Skis</p>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">Jet ski rental in Miami.</h1>
      </Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Section>
  );
}
