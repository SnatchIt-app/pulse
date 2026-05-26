import Image from "next/image";
import Link from "next/link";
import type { FleetPreviewItem } from "@/data/fleet-preview";

export default function VehicleCard({ vehicle }: { vehicle: FleetPreviewItem }) {
  return (
    <Link
      href={`/fleet/${vehicle.slug}`}
      className="group block"
      aria-label={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-graphite">
        <Image
          src={vehicle.image}
          alt={vehicle.alt}
          fill
          sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
          className="object-cover transition-transform duration-pulse ease-pulse group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <div>
          <p className="text-ink/50 text-[10px] uppercase tracking-[0.22em]">
            {vehicle.year} · {vehicle.make}
          </p>
          <p className="mt-1 font-display text-2xl leading-tight">{vehicle.model}</p>
        </div>
        <p className="text-ink/70 whitespace-nowrap text-xs uppercase tracking-[0.18em]">
          from ${vehicle.dailyRateFrom.toLocaleString()}/day
        </p>
      </div>
    </Link>
  );
}
