import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { buildBreadcrumbJsonLd } from "@/lib/schema";
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
    title: `${label} Rental in Miami`,
    description: `Rent the ${label} in Miami with Pulse.`,
    path: `/fleet/${slug}`,
    ogImagePath: `/api/og/${slug}`,
  });
}

export default async function VehiclePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const label = slug.replace(/-/g, " ");
  const jsonLd = buildBreadcrumbJsonLd([
    { name: "Fleet", path: "/fleet" },
    { name: label, path: `/fleet/${slug}` },
  ]);
  return (
    <Section className="pt-32">
      <Container>
        <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Fleet</p>
        <h1 className="mt-4 font-display text-4xl capitalize">{label}</h1>
        <p className="mt-6 text-ink/60">Vehicle detail page lands in Phase 3.</p>
      </Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Section>
  );
}
