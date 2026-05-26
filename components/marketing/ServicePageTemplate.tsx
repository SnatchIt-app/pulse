import Image from "next/image";
import Link from "next/link";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import MotionFade from "@/components/shared/MotionFade";
import { MotionStagger, MotionStaggerItem } from "@/components/shared/MotionStagger";
import FaqBlock from "./FaqBlock";
import EntityOpener from "./EntityOpener";
import type { ServiceContent } from "@/data/service-content";
import type { FaqItem } from "@/data/faqs";
import { buildFaqPageJsonLd, buildServiceJsonLd } from "@/lib/schema";

// Single template for every service page. SEO/AEO baked in:
// emits Service + FAQPage JSON-LD; renders entity opener + FAQ block.
export default function ServicePageTemplate({
  content,
  faqs,
}: {
  content: ServiceContent;
  faqs: ReadonlyArray<FaqItem>;
}) {
  const jsonLd = [
    buildServiceJsonLd({
      name: content.schema.name,
      description: content.schema.description,
      path: content.route,
    }),
    buildFaqPageJsonLd(faqs),
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-ink text-paper">
        <div className="relative aspect-[16/9] w-full md:aspect-[16/7]">
          <Image
            src={content.heroImage}
            alt={content.heroAlt}
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-75"
          />
          <div className="from-ink/80 via-ink/30 to-ink/80 absolute inset-0 bg-gradient-to-b" />
        </div>
        <Container className="relative -mt-40 pb-16 md:-mt-56 md:pb-24">
          <MotionFade>
            <p className="text-paper/70 text-[11px] uppercase tracking-[0.28em]">
              {content.eyebrow}
            </p>
            <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[0.98] sm:text-6xl md:text-7xl">
              {content.heading}
            </h1>
          </MotionFade>
        </Container>
      </section>

      <EntityOpener body={content.opener} />

      {/* What's included */}
      <Section className="bg-paper">
        <Container>
          <p className="text-ink/55 text-[11px] uppercase tracking-[0.24em]">
            What&apos;s included
          </p>
          <MotionStagger className="border-ink/10 mt-10 grid grid-cols-1 border-t md:grid-cols-3">
            {content.included.map((it) => (
              <MotionStaggerItem key={it.title}>
                <div className="border-ink/10 border-b px-1 py-10 md:px-8 md:[&:not(:last-child)]:border-r">
                  <h3 className="font-display text-2xl">{it.title}</h3>
                  <p className="text-ink/65 mt-4 text-sm leading-relaxed sm:text-base">{it.body}</p>
                </div>
              </MotionStaggerItem>
            ))}
          </MotionStagger>
        </Container>
      </Section>

      {/* Sample experiences */}
      {content.experiences.length > 0 ? (
        <Section className="bg-bone/30">
          <Container>
            <p className="text-ink/55 text-[11px] uppercase tracking-[0.24em]">
              Sample experiences
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-3xl leading-[1.05] sm:text-4xl md:text-5xl">
              A few ways Pulse builds it.
            </h2>
            <MotionStagger className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {content.experiences.map((x) => (
                <MotionStaggerItem key={x.title}>
                  <div className="border-ink/10 border bg-paper p-6">
                    <p className="font-display text-2xl">{x.title}</p>
                    <p className="text-ink/65 mt-3 text-sm sm:text-base">{x.body}</p>
                    {x.from ? (
                      <p className="text-ink/55 mt-6 text-[11px] uppercase tracking-[0.22em]">
                        {x.from}
                      </p>
                    ) : null}
                  </div>
                </MotionStaggerItem>
              ))}
            </MotionStagger>
          </Container>
        </Section>
      ) : null}

      <FaqBlock items={faqs} />

      {/* Request CTA — full form ships Phase 4 */}
      <Section className="bg-ink text-paper">
        <Container>
          <MotionFade>
            <p className="text-paper/55 text-[11px] uppercase tracking-[0.24em]">Request</p>
            <h2 className="mt-6 max-w-3xl font-display text-4xl leading-[1.02] sm:text-5xl md:text-6xl">
              Ready when you are.
            </h2>
            <Link
              href={`/request?service=${encodeURIComponent(content.route.replace("/", ""))}`}
              className="mt-10 inline-flex items-center justify-center bg-paper px-7 py-4 text-[11px] uppercase tracking-[0.22em] text-ink transition-colors duration-pulse ease-pulse hover:bg-bone"
            >
              Request Access
            </Link>
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
