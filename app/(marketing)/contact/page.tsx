import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";

export const metadata: Metadata = buildMetadata({ route: "/contact", path: "/contact" });

export default function ContactPage() {
  return (
    <Section className="pt-32">
      <Container>
        <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Contact</p>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">Reach Pulse.</h1>
      </Container>
    </Section>
  );
}
