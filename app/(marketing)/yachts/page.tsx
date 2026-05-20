import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { buildServiceJsonLd } from "@/lib/schema";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";

export const metadata: Metadata = buildMetadata({ route: "/yachts", path: "/yachts" });

const jsonLd = buildServiceJsonLd({
  name: "Yacht Charter in Miami",
  description: "Yacht charter and day experiences in Miami via Pulse.",
  path: "/yachts",
});

export default function YachtsPage() {
  return (
    <Section className="pt-32">
      <Container>
        <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Pulse Yachts</p>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">Yacht charter in Miami.</h1>
      </Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Section>
  );
}
