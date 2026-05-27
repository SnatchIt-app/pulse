import Link from "next/link";
import type { Car } from "@/types/inventory";

// Phase 3: no verified image URL yet — renders a branded placeholder.
// cover_thumbnail is stored in sources/processed but has no public path.
export default function CarCard({ car }: { car: Car }) {
  const subtitle = car.body_style ? `${car.color_label} · ${car.body_style}` : car.color_label;

  return (
    <Link
      href={`/fleet/${car.slug}`}
      className="group block"
      aria-label={`${car.make} ${car.model} — ${subtitle}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-graphite">
        <span className="absolute bottom-6 left-6 select-none font-display text-5xl leading-none text-white/[0.06]">
          {car.make.split("-")[0]}
        </span>
        <div className="from-graphite/60 absolute inset-0 bg-gradient-to-t via-transparent to-transparent transition-opacity duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-80" />
      </div>
      <div className="mt-4">
        <p className="text-ink/55 text-[10px] uppercase tracking-[0.22em]">{car.make}</p>
        <p className="mt-2 font-display text-2xl leading-tight">{car.model}</p>
        <p className="text-ink/50 mt-1 text-[10px] uppercase tracking-[0.18em]">{subtitle}</p>
      </div>
    </Link>
  );
}
