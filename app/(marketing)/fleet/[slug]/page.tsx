import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { buildBreadcrumbJsonLd } from "@/lib/schema";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import MotionFade from "@/components/shared/MotionFade";
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

  return (
    <>
      <div className="w-full bg-graphite pt-20">
        <div className="relative mx-auto flex aspect-[16/9] max-h-[600px] w-full max-w-screen-xl items-end overflow-hidden px-6 pb-10 md:px-24 md:pb-16">
          <span className="select-none font-display text-[clamp(2rem,20vw,5rem)] leading-none text-white/[0.04] sm:text-[clamp(3rem,16vw,10rem)]">
            {car.make.split("-")[0]}
          </span>
          <div className="from-graphite/80 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
        </div>
      </div>

      <Section className="bg-paper pt-16">
        <Container>
          <MotionFade>
            <p className="text-ink/55 text-[10px] uppercase tracking-[0.24em]">
              <Link href="/fleet" className="hover:text-ink">
                Fleet
              </Link>
              {" / "}
              {car.make}
            </p>
            <h1 className="mt-6 font-display text-5xl leading-[0.96] sm:text-6xl md:text-7xl">
              {car.make}
              <br />
              {car.model}
            </h1>
            <p className="text-ink/55 mt-4 text-[11px] uppercase tracking-[0.24em]">{subtitle}</p>

            <div className="border-ink/10 mt-12 border-t pt-10">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                <div>
                  <p className="text-ink/40 text-[9px] uppercase tracking-[0.2em]">Make</p>
                  <p className="mt-1 font-display text-lg">{car.make}</p>
                </div>
                <div>
                  <p className="text-ink/40 text-[9px] uppercase tracking-[0.2em]">Model</p>
                  <p className="mt-1 font-display text-lg">{car.model}</p>
                </div>
                <div>
                  <p className="text-ink/40 text-[9px] uppercase tracking-[0.2em]">Exterior</p>
                  <p className="mt-1 font-display text-lg">{car.exterior_color}</p>
                </div>
                {car.interior_color && car.interior_color !== car.exterior_color && (
                  <div>
                    <p className="text-ink/40 text-[9px] uppercase tracking-[0.2em]">Interior</p>
                    <p className="mt-1 font-display text-lg">{car.interior_color}</p>
                  </div>
                )}
                {car.body_style && (
                  <div>
                    <p className="text-ink/40 text-[9px] uppercase tracking-[0.2em]">Body</p>
                    <p className="mt-1 font-display text-lg">{car.body_style}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-14">
              <p className="text-ink/55 mb-6 max-w-md text-sm leading-relaxed">
                Pricing is by quote. A Pulse specialist responds within 15 minutes with availability
                and a tailored rate.
              </p>
              <Link
                href="/request"
                className="inline-flex items-center justify-center bg-ink px-8 py-4 text-[11px] uppercase tracking-[0.22em] text-paper transition-colors duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-graphite"
              >
                Request a Quote
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
