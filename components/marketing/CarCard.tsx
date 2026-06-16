import Link from "next/link";
import type { Car } from "@/types/inventory";
import InventoryCardMedia from "./InventoryCardMedia";

export default function CarCard({ car }: { car: Car }) {
  const subtitle = car.body_style ? `${car.color_label} · ${car.body_style}` : car.color_label;
  const coverImage = car.images?.[0] ?? null;
  const watermark = car.make.split("-")[0] ?? car.make;

  return (
    <Link
      href={`/fleet/${car.slug}`}
      className="group block"
      aria-label={`${car.make} ${car.model} — ${subtitle}`}
    >
      <InventoryCardMedia
        src={coverImage}
        alt={`${car.make} ${car.model} — ${car.color_label}`}
        aspect="car"
        fallbackWatermark={watermark}
      />
      <div className="mt-4">
        <p className="text-ink/55 text-[10px] uppercase tracking-[0.22em]">{car.make}</p>
        <p className="mt-2 font-display text-2xl leading-tight">{car.model}</p>
        <p className="text-ink/50 mt-1 text-[10px] uppercase tracking-[0.18em]">{subtitle}</p>
      </div>
    </Link>
  );
}
