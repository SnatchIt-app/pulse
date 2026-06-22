import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { buildBreadcrumbJsonLd } from "@/lib/schema";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import MotionFade from "@/components/shared/MotionFade";
import { TrackView, TrackLink } from "@/components/shared/Analytics";
import { residences } from "@/data/inventory/residences";

type Params = { slug: string };

export function generateStaticParams(): { slug: string }[] {
  return residences.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const r = residences.find((x) => x.slug === slug);
  if (!r) return {};
  return buildMetadata({
    title: `${r.title} | Pulse Residences`,
    description: `${r.title} in ${r.neighborhood}: ${r.bedrooms} bedrooms, ${r.bathrooms} bathrooms, sleeps ${r.maxGuests}. Book with Pulse.`,
    path: `/residences/${r.slug}`,
  });
}

export default async function ResidencePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const r = residences.find((x) => x.slug === slug);
  if (!r) notFound();

  const coverImage = r.images?.[0] ?? null;
  const requestHref = `/request?residence=${r.slug}&title=${encodeURIComponent(r.title)}`;

  const jsonLd = buildBreadcrumbJsonLd([
    { name: "Pulse Residences", path: "/residences" },
    { name: r.title, path: `/residences/${r.slug}` },
  ]);

  return (
    <>
      <TrackView event="residence_view" params={{ slug: r.slug }} />

      {/* Hero image */}
      {coverImage && (
        <div className="relative w-full overflow-hidden bg-bone pt-[4.5rem]">
          <Image
            src={coverImage}
            alt={`${r.title}, ${r.neighborhood}`}
            width={1600}
            height={1067}
            priority
            sizes="100vw"
            className="block h-auto w-full"
          />
        </div>
      )}

      {/* Property details */}
      <Section className={`bg-paper ${coverImage ? "pt-14" : "pt-32"} pb-4`}>
        <Container>
          <MotionFade>
            <p className="text-ink/55 text-[11px] uppercase tracking-[0.24em]">{r.neighborhood}</p>
            <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl md:text-6xl">
              {r.title}
            </h1>
          </MotionFade>
        </Container>
      </Section>

      {/* Specs */}
      <Section className="bg-paper pb-12 pt-6">
        <Container>
          <MotionFade delay={0.05}>
            <dl className="border-ink/10 grid grid-cols-2 gap-px border sm:grid-cols-4">
              {[
                { label: "Bedrooms", value: String(r.bedrooms) },
                { label: "Bathrooms", value: String(r.bathrooms) },
                { label: "Sleeps", value: String(r.maxGuests) },
                { label: "Availability", value: "By Request" },
              ].map(({ label, value }) => (
                <div key={label} className="border-ink/10 border bg-paper px-6 py-5">
                  <dt className="text-ink/40 text-[9px] uppercase tracking-[0.22em]">{label}</dt>
                  <dd className="mt-2 font-display text-2xl">{value}</dd>
                </div>
              ))}
            </dl>
          </MotionFade>
        </Container>
      </Section>

      {/* Amenities */}
      <Section className="bg-paper pb-16 pt-4">
        <Container>
          <MotionFade delay={0.08}>
            <p className="text-ink/40 text-[10px] uppercase tracking-[0.22em]">Amenities</p>
            <ul className="mt-5 grid grid-cols-1 gap-x-10 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
              {r.amenities.map((a) => (
                <li key={a} className="text-ink/70 flex items-start gap-3 text-sm">
                  <span className="text-ink/25 mt-0.5 shrink-0 text-[10px]">·</span>
                  {a}
                </li>
              ))}
            </ul>
          </MotionFade>
        </Container>
      </Section>

      {/* CTA band */}
      <Section className="bg-ink py-16">
        <Container>
          <MotionFade>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-paper/40 text-[10px] uppercase tracking-[0.24em]">
                  Request This Residence
                </p>
                <p className="mt-3 max-w-lg font-display text-2xl text-paper sm:text-3xl">
                  A Pulse specialist will confirm availability within 15 minutes.
                </p>
              </div>
              <TrackLink
                href={requestHref}
                trackEvent="residence_request_click"
                trackParams={{ slug: r.slug }}
                className="bg-paper px-8 py-4 text-[11px] uppercase tracking-[0.22em] text-ink transition-colors duration-[480ms] hover:bg-bone"
              >
                Request →
              </TrackLink>
            </div>
          </MotionFade>
        </Container>
      </Section>

      {/* Back link */}
      <Section className="bg-paper py-10">
        <Container>
          <Link
            href="/residences"
            className="text-ink/35 text-[10px] uppercase tracking-[0.18em] transition-colors hover:text-ink"
          >
            ← All Residences
          </Link>
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
