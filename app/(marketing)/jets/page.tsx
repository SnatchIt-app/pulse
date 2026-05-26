import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { buildServiceJsonLd } from "@/lib/schema";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";

export const metadata: Metadata = buildMetadata({ route: "/jets", path: "/jets" });

const jsonLd = buildServiceJsonLd({
  name: "Private Jet Charter from Miami",
  description: "Private jet charter from Miami via Pulse.",
  path: "/jets",
});

export default function JetsPage() {
  return (
    <Section className="pt-32">
      <Container>
        <p className="text-ink/60 text-xs uppercase tracking-[0.2em]">Pulse Jets</p>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">Private jet charter from Miami.</h1>
      </Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Section>
  );
}
