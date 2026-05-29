import Image from "next/image";
import Link from "next/link";
import type { Residence } from "@/types/inventory";

// PUBLIC projection only — _source and internal fields are never accessed here.
export default function ResidenceCard({ residence }: { residence: Residence }) {
  const coverImage = residence.images?.[0] ?? null;

  return (
    <Link
      href={`/residences/${residence.slug}`}
      className="group block"
      aria-label={`${residence.title} — ${residence.neighborhood}`}
    >
      <div className="overflow-hidden">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={`${residence.title} — ${residence.neighborhood}`}
            width={1600}
            height={1067}
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            className="block h-auto w-full transition-opacity duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-90"
          />
        ) : (
          <div className="relative aspect-[4/3] bg-bone">
            <div className="from-bone/60 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-ink/55 text-[10px] uppercase tracking-[0.22em]">
          {residence.neighborhood}
        </p>
        <p className="mt-2 font-display text-2xl leading-tight">{residence.title}</p>
        <p className="text-ink/50 mt-1 text-[10px] uppercase tracking-[0.18em]">
          {residence.bedrooms} BR · {residence.bathrooms} BA · sleeps {residence.maxGuests}
        </p>
      </div>
    </Link>
  );
}
