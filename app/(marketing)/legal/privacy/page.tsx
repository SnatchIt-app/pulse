import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";

export const metadata: Metadata = buildMetadata({
  title: "Privacy",
  description: "Pulse privacy policy.",
  path: "/legal/privacy",
});

export default function PrivacyPage() {
  return (
    <Section className="pt-32">
      <Container>
        <h1 className="font-display text-4xl">Privacy</h1>
        <p className="mt-6 text-ink/60">Final legal copy to be provided.</p>
      </Container>
    </Section>
  );
}
