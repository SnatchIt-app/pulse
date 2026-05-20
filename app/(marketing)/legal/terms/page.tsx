import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";

export const metadata: Metadata = buildMetadata({
  title: "Terms",
  description: "Pulse terms and conditions.",
  path: "/legal/terms",
});

export default function TermsPage() {
  return (
    <Section className="pt-32">
      <Container>
        <h1 className="font-display text-4xl">Terms</h1>
        <p className="mt-6 text-ink/60">Final legal copy to be provided.</p>
      </Container>
    </Section>
  );
}
