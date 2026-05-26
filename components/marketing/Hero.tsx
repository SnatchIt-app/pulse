import Image from "next/image";
import Link from "next/link";
import Container from "@/components/shared/Container";
import MotionFade from "@/components/shared/MotionFade";
import { HOMEPAGE_MEDIA } from "@/data/media";

export default function Hero() {
  const m = HOMEPAGE_MEDIA.hero;
  return (
    <section className="relative isolate min-h-[88vh] overflow-hidden bg-ink text-paper">
      <Image
        src={m.placeholder}
        alt={m.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-70"
      />
      <div className="from-ink/80 via-ink/30 to-ink/80 absolute inset-0 bg-gradient-to-b" />
      <Container className="relative flex min-h-[88vh] flex-col justify-end pb-24 pt-40 md:pb-32">
        <MotionFade>
          <p className="text-paper/70 text-[11px] uppercase tracking-[0.28em]">Pulse · Miami</p>
          <h1 className="mt-6 max-w-5xl font-display text-5xl leading-[0.96] sm:text-7xl md:text-[clamp(64px,8vw,128px)]">
            Luxury mobility, on call.
          </h1>
          <p className="text-paper/75 mt-8 max-w-xl text-base sm:text-lg">
            Exotic cars first. Then jets, yachts, residences, and concierge access. One Miami
            operator, one quiet line.
          </p>
          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/fleet"
              className="inline-flex items-center justify-center bg-paper px-7 py-4 text-[11px] uppercase tracking-[0.22em] text-ink transition-colors duration-pulse ease-pulse hover:bg-bone"
            >
              View the Fleet
            </Link>
            <Link
              href="/request"
              className="border-paper/60 inline-flex items-center justify-center border px-7 py-4 text-[11px] uppercase tracking-[0.22em] text-paper transition-colors duration-pulse ease-pulse hover:bg-paper hover:text-ink"
            >
              Request Access
            </Link>
          </div>
        </MotionFade>
      </Container>
    </section>
  );
}
