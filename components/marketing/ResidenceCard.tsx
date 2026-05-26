import Image from "next/image";
import Link from "next/link";
import type { ResidencePreviewItem } from "@/data/residences-preview";

// PUBLIC projection only — never accept vendor/internal fields.
export default function ResidenceCard({ residence }: { residence: ResidencePreviewItem }) {
  return (
    <Link
      href={`/residences/${residence.slug}`}
      className="group block"
      aria-label={`${residence.title} — ${residence.publicLocationLabel}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-bone">
        <Image
          src={residence.image}
          alt={residence.alt}
          fill
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover transition-transform duration-pulse ease-pulse group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-4">
        <p className="text-ink/55 text-[10px] uppercase tracking-[0.22em]">
          {residence.publicLocationLabel}
        </p>
        <p className="mt-2 font-display text-2xl leading-tight">{residence.title}</p>
        <p className="text-ink/65 mt-2 text-xs uppercase tracking-[0.18em]">
          {residence.bedrooms} BR · sleeps {residence.maxGuests} · from $
          {residence.nightlyRateFrom.toLocaleString()}/night
        </p>
      </div>
    </Link>
  );
}
