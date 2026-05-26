import Image from "next/image";
import Container from "@/components/shared/Container";
import MotionFade from "@/components/shared/MotionFade";
import { HOMEPAGE_MEDIA } from "@/data/media";

export default function EditorialBlock() {
  const m = HOMEPAGE_MEDIA.editorial;
  return (
    <section className="relative isolate overflow-hidden bg-ink text-paper">
      <div className="relative aspect-[16/10] w-full md:aspect-[16/7]">
        <Image
          src={m.placeholder}
          alt={m.alt}
          fill
          sizes="100vw"
          className="object-cover opacity-80"
        />
        <div className="from-ink/70 via-ink/20 to-ink/70 absolute inset-0 bg-gradient-to-r" />
      </div>
      <Container className="relative -mt-32 pb-24 md:-mt-48 md:pb-32">
        <MotionFade>
          <p className="text-paper/60 text-[11px] uppercase tracking-[0.24em]">Pulse · Miami</p>
          <blockquote className="mt-6 max-w-3xl font-display text-3xl leading-[1.1] sm:text-5xl md:text-6xl">
            “Miami doesn&apos;t slow down. Neither do we.”
          </blockquote>
        </MotionFade>
      </Container>
    </section>
  );
}
