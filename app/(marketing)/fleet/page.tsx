import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";

export const metadata: Metadata = buildMetadata({ route: "/fleet", path: "/fleet" });

export default function FleetPage() {
  return (
    <Section className="pt-32">
      <Container>
        <p className="text-xs uppercase tracking-[0.2em] text-ink/60">The Fleet</p>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">Exotic &amp; supercars in Miami.</h1>
        <p className="mt-6 max-w-xl text-ink/60">Fleet grid lands in Phase 3.</p>
      </Container>
    </Section>
  );
}
