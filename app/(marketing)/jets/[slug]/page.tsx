import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { buildBreadcrumbJsonLd } from "@/lib/schema";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import MotionFade from "@/components/shared/MotionFade";
import { jets } from "@/data/inventory/jets";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return jets.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const jet = jets.find((j) => j.slug === slug);
  if (!jet) return buildMetadata({ path: `/jets/${slug}` });
  return buildMetadata({
    title: `${jet.name} Charter from Miami`,
    description: `Charter the ${jet.name} (${jet.category}, up to ${jet.capacity} passengers) from Miami with Pulse. Quote-only — contact a specialist to arrange.`,
    path: `/jets/${slug}`,
  });
}

export default async function JetPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const jet = jets.find((j) => j.slug === slug);
  if (!jet) notFound();

  const heroImage = jet.images?.[0] ?? null;
  const requestHref = `/request?jet=${slug}&title=${encodeURIComponent(jet.name)}`;

  const jsonLd = buildBreadcrumbJsonLd([
    { name: "Jets", path: "/jets" },
    { name: jet.name, path: `/jets/${slug}` },
  ]);

  const specs: { label: string; value: string }[] = [
    { label: "Category", value: jet.category },
    { label: "Passengers", value: `Up to ${jet.capacity}` },
    { label: "Tier", value: "Ultra-Luxury" },
  ];

  return (
    <>
      {/* Hero */}
      <div className="w-full pt-20">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={jet.name}
            width={1600}
            height={1067}
            priority
            sizes="100vw"
            className="block h-auto w-full"
          />
        ) : (
          <div className="bg-graphite px-6 md:px-16">
            <div className="mx-auto flex aspect-[16/9] max-h-[560px] max-w-5xl items-end pb-10">
              <span className="select-none font-display text-[clamp(2rem,20vw,5rem)] leading-none text-white/[0.04] sm:text-[clamp(3rem,16vw,10rem)]">
                Jet
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Identity + specs */}
      <Section className="bg-paper pb-0 pt-12 md:pb-0 md:pt-16">
        <Container>
          <MotionFade>
            {/* Breadcrumb */}
            <p className="text-ink/45 text-[10px] uppercase tracking-[0.24em]">
              <Link href="/jets" className="transition-colors hover:text-ink">
                Jets
              </Link>
              <span className="mx-2">·</span>
              {jet.category}
            </p>

            {/* Headline */}
            <h1 className="mt-5 font-display text-5xl leading-[0.96] sm:text-6xl md:text-7xl">
              {jet.name}
            </h1>
            <p className="text-ink/50 mt-3 text-[11px] uppercase tracking-[0.26em]">
              {jet.category} · Up to {jet.capacity} passengers
            </p>

            {/* Specs grid */}
            <dl className="border-ink/10 mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t pt-8 sm:grid-cols-3 lg:grid-cols-4">
              {specs.map((s) => (
                <div key={s.label}>
                  <dt className="text-ink/40 text-[9px] uppercase tracking-[0.22em]">{s.label}</dt>
                  <dd className="mt-1 font-display text-lg leading-tight">{s.value}</dd>
                </div>
              ))}
            </dl>

            {/* Quote note */}
            <p className="text-ink/45 mt-10 max-w-lg text-sm leading-relaxed">
              All charters are available by quote only. A Pulse specialist responds within 15
              minutes with availability and a tailored rate for your route and dates.
            </p>

            {/* Primary CTA */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link
                href={requestHref}
                className="inline-flex items-center justify-center bg-ink px-8 py-4 text-[11px] uppercase tracking-[0.22em] text-paper transition-colors duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-graphite"
              >
                Request a Quote
              </Link>
              <Link
                href="/jets"
                className="text-ink/50 text-[11px] uppercase tracking-[0.22em] transition-colors duration-[480ms] hover:text-ink"
              >
                ← Back to Jets
              </Link>
            </div>
          </MotionFade>
        </Container>
      </Section>

      {/* Dark CTA band */}
      <Section className="mt-20 bg-ink text-paper">
        <Container>
          <MotionFade>
            <p className="text-paper/50 text-[11px] uppercase tracking-[0.24em]">Pulse Concierge</p>
            <h2 className="mt-5 max-w-2xl font-display text-4xl leading-[1.0] sm:text-5xl">
              Charter the {jet.name}.
            </h2>
            <p className="text-paper/60 mt-5 max-w-md text-sm leading-relaxed">
              Quote-only. No booking fees, no surprises. A Pulse specialist builds your rate based
              on route, dates, and any ground arrangements you need.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href={requestHref}
                className="inline-flex items-center justify-center bg-paper px-8 py-4 text-[11px] uppercase tracking-[0.22em] text-ink transition-colors duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-bone"
              >
                Request a Quote
              </Link>
              <Link
                href="/concierge"
                className="border-paper/30 inline-flex items-center justify-center border px-8 py-4 text-[11px] uppercase tracking-[0.22em] text-paper transition-colors duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-paper hover:text-ink"
              >
                How Pulse works
              </Link>
            </div>
          </MotionFade>
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
