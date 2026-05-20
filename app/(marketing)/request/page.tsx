import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";

export const metadata: Metadata = buildMetadata({ route: "/request", path: "/request" });

export default function RequestPage() {
  return (
    <Section className="pt-32">
      <Container>
        <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Request</p>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">Tell us what you need.</h1>
        <p className="mt-6 max-w-xl text-ink/60">Universal request form lands in Phase 4.</p>
      </Container>
    </Section>
  );
}
