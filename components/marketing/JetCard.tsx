import Image from "next/image";
import Link from "next/link";
import type { Jet } from "@/types/inventory";

export default function JetCard({ jet }: { jet: Jet }) {
  const coverImage = jet.images?.[0] ?? null;

  return (
    <Link
      href={`/jets/${jet.slug}`}
      className="group block"
      aria-label={`${jet.name} — ${jet.category}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-graphite">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={jet.name}
            fill
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            className="object-cover transition-opacity duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-90"
          />
        ) : (
          <>
            <span className="absolute bottom-6 left-6 select-none font-display text-5xl leading-none text-white/[0.06]">
              Jet
            </span>
            <div className="from-graphite/60 absolute inset-0 bg-gradient-to-t via-transparent to-transparent transition-opacity duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-80" />
          </>
        )}
      </div>
      <div className="mt-4">
        <p className="text-ink/55 text-[10px] uppercase tracking-[0.22em]">{jet.category}</p>
        <p className="mt-2 font-display text-2xl leading-tight">{jet.name}</p>
        <p className="text-ink/50 mt-1 text-[10px] uppercase tracking-[0.18em]">
          Up to {jet.capacity} passengers
        </p>
      </div>
    </Link>
  );
}
