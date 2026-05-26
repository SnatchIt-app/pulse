import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { buildServiceJsonLd } from "@/lib/schema";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";

export const metadata: Metadata = buildMetadata({ route: "/restaurants", path: "/restaurants" });

const jsonLd = buildServiceJsonLd({
  name: "VIP Restaurant Reservations in Miami",
  description: "Hard-to-book tables at Miami's top restaurants via Pulse's concierge network.",
  path: "/restaurants",
});

export default function RestaurantsPage() {
  return (
    <Section className="pt-32">
      <Container>
        <p className="text-ink/60 text-xs uppercase tracking-[0.2em]">Pulse Dining</p>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">VIP reservations in Miami.</h1>
      </Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Section>
  );
}
