import Link from "next/link";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import MotionFade from "@/components/shared/MotionFade";

export default function ConciergeCTA() {
  return (
    <Section className="bg-ink text-paper">
      <Container>
        <MotionFade>
          <p className="text-paper/55 text-[11px] uppercase tracking-[0.24em]">Pulse Concierge</p>
          <h2 className="mt-6 max-w-4xl font-display text-5xl leading-[0.98] sm:text-6xl md:text-7xl">
            Tell us what you want.
          </h2>
          <p className="text-paper/65 mt-6 max-w-xl text-base sm:text-lg">
            A Pulse specialist replies within 15 minutes. Anything inside a Miami stay is on the
            table.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/request"
              className="inline-flex items-center justify-center bg-paper px-7 py-4 text-[11px] uppercase tracking-[0.22em] text-ink transition-colors duration-pulse ease-pulse hover:bg-bone"
            >
              Request Access
            </Link>
            <Link
              href="/concierge"
              className="border-paper/40 inline-flex items-center justify-center border px-7 py-4 text-[11px] uppercase tracking-[0.22em] text-paper transition-colors duration-pulse ease-pulse hover:bg-paper hover:text-ink"
            >
              How Pulse works
            </Link>
          </div>
        </MotionFade>
      </Container>
    </Section>
  );
}
