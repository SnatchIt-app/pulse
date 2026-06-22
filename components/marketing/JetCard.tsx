import Link from "next/link";
import type { Jet } from "@/types/inventory";
import InventoryCardMedia from "./InventoryCardMedia";

export default function JetCard({ jet }: { jet: Jet }) {
  const coverImage = jet.images?.[0] ?? null;

  return (
    <Link
      href={`/jets/${jet.slug}`}
      className="group block"
      aria-label={`${jet.name}, ${jet.category}`}
    >
      <InventoryCardMedia src={coverImage} alt={jet.name} aspect="jet" fallbackWatermark="Jet" />
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
