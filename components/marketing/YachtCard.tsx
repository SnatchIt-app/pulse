import Link from "next/link";
import type { Yacht } from "@/types/inventory";
import InventoryCardMedia from "./InventoryCardMedia";

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
      <InventoryCardMedia
        src={coverImage}
        alt={title}
        aspect="yacht"
        fallbackWatermark={yacht.make}
      />
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
