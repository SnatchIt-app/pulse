import Image from "next/image";
import Link from "next/link";
import type { Yacht } from "@/types/inventory";

function getDisplayTitle(yacht: Yacht): string {
  if (yacht.name) {
    return yacht.length_ft
      ? `${yacht.length_ft}' ${yacht.make} — ${yacht.name}`
      : `${yacht.make} — ${yacht.name}`;
  }
  return yacht.model ? `${yacht.make} ${yacht.model}` : yacht.make;
}

export default function YachtCard({ yacht }: { yacht: Yacht }) {
  const title = getDisplayTitle(yacht);
  const coverImage = yacht.images?.[0] ?? null;

  return (
    <Link href={`/yachts/${yacht.slug}`} className="group block" aria-label={title}>
      <div className="relative aspect-[4/3] overflow-hidden bg-graphite">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            className="object-cover transition-opacity duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-90"
          />
        ) : (
          <>
            <span className="absolute bottom-6 left-6 select-none font-display text-5xl leading-none text-white/[0.06]">
              {yacht.make}
            </span>
            <div className="from-graphite/60 absolute inset-0 bg-gradient-to-t via-transparent to-transparent transition-opacity duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-80" />
          </>
        )}
      </div>
      <div className="mt-4">
        <p className="text-ink/55 text-[10px] uppercase tracking-[0.22em]">{yacht.make}</p>
        <p className="mt-2 font-display text-2xl leading-tight">
          {yacht.name ?? yacht.model ?? yacht.make}
        </p>
        {yacht.length_ft && (
          <p className="text-ink/50 mt-1 text-[10px] uppercase tracking-[0.18em]">
            {yacht.length_ft} ft
          </p>
        )}
      </div>
    </Link>
  );
}
