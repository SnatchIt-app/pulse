import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { buildServiceJsonLd } from "@/lib/schema";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";

export const metadata: Metadata = buildMetadata({ route: "/nightlife", path: "/nightlife" });

const jsonLd = buildServiceJsonLd({
  name: "VIP Nightlife & Club Access in Miami",
  description: "Tables, bottle service, and guest-list access at Miami's top clubs via Pulse.",
  path: "/nightlife",
});

export default function NightlifePage() {
  return (
    <Section className="pt-32">
      <Container>
        <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Pulse Nightlife</p>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">VIP club access in Miami.</h1>
      </Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Section>
  );
}
