import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { buildBreadcrumbJsonLd } from "@/lib/schema";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import MotionFade from "@/components/shared/MotionFade";
import { TrackView, TrackLink } from "@/components/shared/Analytics";
import { cars } from "@/data/inventory/cars";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return cars.map((car) => ({ slug: car.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const car = cars.find((c) => c.slug === slug);
  if (!car) return buildMetadata({ path: `/fleet/${slug}` });
  return buildMetadata({
    title: `${car.make} ${car.model} ${car.color_label} in Miami`,
    description: `Rent the ${car.make} ${car.model} (${car.color_label}) in Miami with Pulse. Quote-only — contact a specialist to arrange.`,
    path: `/fleet/${slug}`,
    ogImagePath: `/api/og/${slug}`,
  });
}

export default async function VehiclePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const car = cars.find((c) => c.slug === slug);
  if (!car) notFound();

  const jsonLd = buildBreadcrumbJsonLd([
    { name: "Fleet", path: "/fleet" },
    { name: `${car.make} ${car.model}`, path: `/fleet/${slug}` },
  ]);

  const subtitle = car.body_style ? `${car.color_label} · ${car.body_style}` : car.color_label;
  const heroImage = car.images?.[0] ?? null;
  const requestHref = `/request?vehicle=${slug}&title=${encodeURIComponent(`${car.make} ${car.model}`)}`;

  // Build spec rows — only fields we have verified data for
  const specs: { label: string; value: string }[] = [
    { label: "Exterior", value: car.exterior_color },
    ...(car.interior_color && car.interior_color !== car.exterior_color
      ? [{ label: "Interior", value: car.interior_color }]
      : []),
    ...(car.body_style ? [{ label: "Body", value: car.body_style }] : []),
    { label: "Tier", value: "Ultra-Luxury" },
  ];

  return (
    <>
      <TrackView event="vehicle_view" params={{ slug }} />

      {/* Hero */}
      <div className="w-full pt-20">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={`${car.make} ${car.model} — ${car.color_label}`}
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
                {car.make.split("-")[0]}
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
              <Link href="/fleet" className="transition-colors hover:text-ink">
                Fleet
              </Link>
              <span className="mx-2">·</span>
              {car.make}
            </p>

            {/* Headline */}
            <h1 className="mt-5 font-display text-5xl leading-[0.96] sm:text-6xl md:text-7xl">
              {car.make}
              <br />
              {car.model}
            </h1>
            <p className="text-ink/50 mt-3 text-[11px] uppercase tracking-[0.26em]">{subtitle}</p>

            {/* Specs grid */}
            <dl className="border-ink/10 mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t pt-8 sm:grid-cols-3 lg:grid-cols-4">
              {specs.map((s) => (
                <div key={s.label}>
                  <dt className="text-ink/40 text-[9px] uppercase tracking-[0.22em]">{s.label}</dt>
                  <dd className="mt-1 font-display text-lg leading-tight">{s.value}</dd>
                </div>
              ))}
            </dl>

            {/* Inline quote note */}
            <p className="text-ink/45 mt-10 max-w-lg text-sm leading-relaxed">
              All vehicles are available by quote only. A Pulse specialist responds within 15
              minutes with availability and a tailored rate.
            </p>

            {/* Primary CTA — inline for above-fold access */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <TrackLink
                href={requestHref}
                trackEvent="vehicle_request_click"
                trackParams={{ slug }}
                className="inline-flex items-center justify-center bg-ink px-8 py-4 text-[11px] uppercase tracking-[0.22em] text-paper transition-colors duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-graphite"
              >
                Request a Quote
              </TrackLink>
              <Link
                href="/fleet"
                className="text-ink/50 text-[11px] uppercase tracking-[0.22em] transition-colors duration-[480ms] hover:text-ink"
              >
                ← Back to Fleet
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
              Reserve the {car.make} {car.model}.
            </h2>
            <p className="text-paper/60 mt-5 max-w-md text-sm leading-relaxed">
              Quote-only. No booking fees, no surprises. A Pulse specialist builds your rate based
              on dates, duration, and any add-ons you need.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <TrackLink
                href={requestHref}
                trackEvent="vehicle_request_click"
                trackParams={{ slug }}
                className="inline-flex items-center justify-center bg-paper px-8 py-4 text-[11px] uppercase tracking-[0.22em] text-ink transition-colors duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-bone"
              >
                Request a Quote
              </TrackLink>
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
