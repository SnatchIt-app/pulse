import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";

export const metadata: Metadata = buildMetadata({ route: "/about", path: "/about" });

export default function AboutPage() {
  return (
    <Section className="pt-32">
      <Container>
        <p className="text-ink/60 text-xs uppercase tracking-[0.2em]">About</p>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">Pulse.</h1>
      </Container>
    </Section>
  );
}
