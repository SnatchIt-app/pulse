import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { buildBreadcrumbJsonLd, buildFaqPageJsonLd } from "@/lib/schema";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const label = slug.replace(/-/g, " ");
  return buildMetadata({
    title: `${label} — Pulse Residence`,
    description: `${label}: a curated Pulse luxury residence in Miami.`,
    path: `/residences/${slug}`,
    ogImagePath: `/api/og/${slug}`,
  });
}

// Public, vendor-free FAQ.
const faqs = [
  {
    q: "How do I reserve this residence?",
    a: "Submit a request with your dates and party size. A Pulse specialist responds within 15 minutes.",
  },
] as const;

export default async function ResidencePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const label = slug.replace(/-/g, " ");
  const jsonLd = [
    buildBreadcrumbJsonLd([
      { name: "Pulse Residences", path: "/residences" },
      { name: label, path: `/residences/${slug}` },
    ]),
    buildFaqPageJsonLd(faqs),
  ];
  return (
    <Section className="pt-32">
      <Container>
        <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Pulse Residences</p>
        <h1 className="mt-4 font-display text-4xl capitalize">{label}</h1>
        <p className="mt-6 text-ink/60">Residence detail page lands in Phase 3.5.</p>
      </Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Section>
  );
}
