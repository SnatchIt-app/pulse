import Link from "next/link";
import type { Residence } from "@/types/inventory";
import InventoryCardMedia from "./InventoryCardMedia";

// PUBLIC projection only — _source and internal fields are never accessed here.
export default function ResidenceCard({ residence }: { residence: Residence }) {
  const coverImage = residence.images?.[0] ?? null;

  return (
    <Link
      href={`/residences/${residence.slug}`}
      className="group block"
      aria-label={`${residence.title}, ${residence.neighborhood}`}
    >
      <InventoryCardMedia
        src={coverImage}
        alt={`${residence.title}, ${residence.neighborhood}`}
        aspect="residence"
      />
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
