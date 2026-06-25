import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { buildBreadcrumbJsonLd } from "@/lib/schema";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import MotionFade from "@/components/shared/MotionFade";
import { MotionStagger, MotionStaggerItem } from "@/components/shared/MotionStagger";
import { ARTICLES_BY_DATE } from "@/data/journal";

export const metadata: Metadata = buildMetadata({
  title: "Pulse Journal | Miami Luxury Travel Guides",
  path: "/journal",
  description:
    "Practical guides from Pulse on exotic car rentals, private travel, and planning a luxury weekend in Miami around major events.",
  keywords: [
    "Miami luxury travel guide",
    "exotic car rental Miami tips",
    "Miami event weekend planning",
    "luxury Miami concierge guide",
  ],
});

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number) as [number, number, number];
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

const jsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Journal", path: "/journal" },
]);

export default function JournalIndexPage() {
  return (
    <>
      <Section className="bg-paper pb-10 pt-32 md:pb-16 md:pt-40">
        <Container>
          <MotionFade>
            <p className="text-ink/55 text-[11px] uppercase tracking-[0.24em]">Pulse Journal</p>
            <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.02] sm:text-5xl md:text-6xl">
              Notes on moving through Miami well.
            </h1>
            <p className="text-ink/65 mt-7 max-w-xl text-base leading-relaxed sm:text-lg">
              Practical guides on exotic car rentals, private travel, and planning a luxury weekend
              in Miami, written by the team that handles it.
            </p>
          </MotionFade>
        </Container>
      </Section>

      <Section className="bg-paper pb-32 pt-4 md:pb-44 md:pt-6">
        <Container>
          <MotionStagger className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
            {ARTICLES_BY_DATE.map((article) => (
              <MotionStaggerItem key={article.slug}>
                <Link href={`/journal/${article.slug}`} className="group block">
                  <article className="border-ink/10 border-t py-10">
                    <div className="text-ink/50 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em]">
                      <span className="text-brass">{article.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatDate(article.datePublished)}</span>
                    </div>
                    <h2 className="mt-5 font-display text-2xl leading-snug transition-opacity group-hover:opacity-60 sm:text-3xl">
                      {article.title}
                    </h2>
                    <p className="text-ink/65 mt-4 max-w-xl text-sm leading-relaxed">
                      {article.excerpt}
                    </p>
                    <span className="mt-6 inline-block text-[11px] uppercase tracking-[0.22em] text-brass">
                      Read the guide
                    </span>
                  </article>
                </Link>
              </MotionStaggerItem>
            ))}
          </MotionStagger>
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
