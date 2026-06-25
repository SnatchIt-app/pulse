import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildFaqPageJsonLd } from "@/lib/schema";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import MotionFade from "@/components/shared/MotionFade";
import FaqBlock from "@/components/marketing/FaqBlock";
import { ARTICLES, getArticle } from "@/data/journal";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return buildMetadata({ title: "Journal", path: "/journal", noindex: true });

  return buildMetadata({
    title: article.title,
    path: `/journal/${article.slug}`,
    description: article.description,
    keywords: article.keywords,
  });
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number) as [number, number, number];
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

export default async function JournalArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const path = `/journal/${article.slug}`;
  const jsonLd = [
    buildArticleJsonLd({
      title: article.title,
      description: article.description,
      path,
      datePublished: article.datePublished,
      dateModified: article.dateModified,
    }),
    buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Journal", path: "/journal" },
      { name: article.title, path },
    ]),
    buildFaqPageJsonLd(article.faqs),
  ];

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Section className="bg-paper pb-8 pt-32 md:pb-12 md:pt-40">
        <Container>
          <MotionFade>
            <div className="text-ink/50 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em]">
              <Link href="/journal" className="transition-opacity hover:opacity-60">
                Journal
              </Link>
              <span aria-hidden="true">·</span>
              <span className="text-brass">{article.category}</span>
              <span aria-hidden="true">·</span>
              <span>{article.readMinutes} min read</span>
            </div>
            <h1 className="mt-6 max-w-4xl font-display text-4xl leading-[1.02] sm:text-5xl md:text-6xl">
              {article.h1}
            </h1>
            <p className="text-ink/65 mt-7 max-w-2xl text-base leading-relaxed sm:text-lg">
              {article.excerpt}
            </p>
            <p className="text-ink/45 mt-6 text-[11px] uppercase tracking-[0.2em]">
              Published {formatDate(article.datePublished)}
            </p>
          </MotionFade>
        </Container>
      </Section>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <Section className="bg-paper pb-20 pt-0 md:pb-28">
        <Container>
          <article className="max-w-2xl">
            <MotionFade>
              <div className="space-y-6">
                {article.intro.map((p, i) => (
                  <p key={i} className="text-ink/80 text-base leading-relaxed sm:text-lg">
                    {p}
                  </p>
                ))}
              </div>
            </MotionFade>

            {article.sections.map((section) => (
              <MotionFade key={section.heading}>
                <div className="mt-14">
                  <h2 className="font-display text-2xl leading-snug sm:text-3xl">
                    {section.heading}
                  </h2>
                  <div className="mt-5 space-y-5">
                    {section.paragraphs.map((p, i) => (
                      <p key={i} className="text-ink/75 text-base leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                  {section.bullets ? (
                    <ul className="mt-6 space-y-3">
                      {section.bullets.map((b) => (
                        <li
                          key={b}
                          className="text-ink/75 border-brass/40 border-l pl-4 text-base leading-relaxed"
                        >
                          {b}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </MotionFade>
            ))}

            {/* Internal links */}
            <MotionFade>
              <div className="border-ink/10 mt-16 border-t pt-10">
                <p className="text-ink/55 text-[11px] uppercase tracking-[0.24em]">
                  Related Pulse services
                </p>
                <ul className="mt-5 space-y-2">
                  {article.internalLinks.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="decoration-brass/50 font-display text-lg text-ink underline underline-offset-4 transition-opacity hover:opacity-60"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </MotionFade>
          </article>
        </Container>
      </Section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <FaqBlock items={article.faqs} heading="Common questions" />

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <Section className="bg-ink text-paper">
        <Container>
          <MotionFade>
            <p className="text-paper/55 text-[11px] uppercase tracking-[0.24em]">Pulse</p>
            <h2 className="mt-5 max-w-2xl font-display text-3xl leading-[1.05] sm:text-4xl md:text-5xl">
              {article.cta.heading}
            </h2>
            <p className="text-paper/70 mt-6 max-w-xl text-sm leading-relaxed sm:text-base">
              {article.cta.body}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/request"
                className="inline-flex items-center justify-center bg-brass px-8 py-4 text-[11px] uppercase tracking-[0.22em] text-ink transition-opacity duration-pulse ease-pulse hover:opacity-90"
              >
                Request Access
              </Link>
              <Link
                href="/fleet"
                className="border-paper/60 inline-flex items-center justify-center border px-8 py-4 text-[11px] uppercase tracking-[0.22em] text-paper transition-colors duration-pulse ease-pulse hover:bg-paper hover:text-ink"
              >
                Browse the Fleet
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
