import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import MotionFade from "@/components/shared/MotionFade";

export const metadata: Metadata = buildMetadata({
  route: "/contact",
  path: "/contact",
  description:
    "Reach the Pulse team — by phone, email, or request form. A specialist responds within 15 minutes.",
});

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <Section className="bg-paper pb-12 pt-32 md:pb-20 md:pt-40">
        <Container>
          <MotionFade>
            <p className="text-ink/55 text-[11px] uppercase tracking-[0.24em]">Contact</p>
            <h1 className="mt-5 max-w-2xl font-display text-5xl leading-[0.96] sm:text-6xl md:text-7xl">
              Reach Pulse.
            </h1>
          </MotionFade>
          <MotionFade delay={0.06}>
            <p className="text-ink/65 mt-6 max-w-lg text-base leading-relaxed">
              A specialist is available to arrange any request — cars, jets, yachts, residences, or
              bespoke concierge. Every inquiry is handled directly, with a response inside 15
              minutes.
            </p>
          </MotionFade>
        </Container>
      </Section>

      {/* Contact channels */}
      <Section className="bg-paper pb-32 pt-0 md:pb-40">
        <Container>
          <MotionFade delay={0.1}>
            <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-24">
              {/* Left — phone + email + response time */}
              <div>
                <div className="border-ink/10 border-t pt-8">
                  <p className="text-ink/45 text-[10px] uppercase tracking-[0.26em]">Phone</p>
                  <a
                    href="tel:+17868624436"
                    className="mt-3 block font-display text-3xl leading-tight transition-opacity hover:opacity-60 sm:text-4xl"
                  >
                    (786) 862-4436
                  </a>
                </div>

                <div className="border-ink/10 mt-10 border-t pt-8">
                  <p className="text-ink/45 text-[10px] uppercase tracking-[0.26em]">Email</p>
                  <a
                    href="mailto:pulsexotics@exoticsinfo.com"
                    className="mt-3 block font-display text-2xl leading-tight transition-opacity hover:opacity-60 sm:text-3xl"
                  >
                    pulsexotics@exoticsinfo.com
                  </a>
                </div>

                <div className="border-ink/10 mt-10 border-t pt-8">
                  <p className="text-ink/45 text-[10px] uppercase tracking-[0.26em]">
                    Response time
                  </p>
                  <p className="mt-3 font-display text-2xl sm:text-3xl">Under 15 minutes</p>
                </div>
              </div>

              {/* Right — request form CTA */}
              <div className="border-ink/10 mt-10 border-t pt-8 md:mt-0">
                <p className="text-ink/45 text-[10px] uppercase tracking-[0.26em]">
                  Prefer a form?
                </p>
                <p className="text-ink/65 mt-4 max-w-sm text-sm leading-relaxed">
                  Submit your request and a Pulse specialist will respond with options tailored to
                  your dates, preferences, and group size. Cars, jets, yachts, residences —
                  everything is arranged by inquiry.
                </p>
                <Link
                  href="/request"
                  className="mt-8 inline-flex items-center justify-center border border-ink px-8 py-4 text-[11px] uppercase tracking-[0.22em] transition-colors duration-pulse ease-pulse hover:bg-ink hover:text-paper"
                >
                  Submit a Request
                </Link>
              </div>
            </div>
          </MotionFade>
        </Container>
      </Section>
    </>
  );
}
