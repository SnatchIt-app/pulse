import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { buildServiceJsonLd } from "@/lib/schema";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";

export const metadata: Metadata = buildMetadata({ route: "/concierge", path: "/concierge" });

const jsonLd = buildServiceJsonLd({
  name: "Pulse Concierge",
  description: "Discreet, on-call luxury concierge in Miami.",
  path: "/concierge",
});

export default function ConciergePage() {
  return (
    <Section className="pt-32">
      <Container>
        <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Pulse Concierge</p>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">Tell us what you want.</h1>
      </Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Section>
  );
}
