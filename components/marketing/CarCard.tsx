import Image from "next/image";
import Link from "next/link";
import type { Car } from "@/types/inventory";

export default function CarCard({ car }: { car: Car }) {
  const subtitle = car.body_style ? `${car.color_label} · ${car.body_style}` : car.color_label;
  const coverImage = car.images?.[0] ?? null;

  return (
    <Link
      href={`/fleet/${car.slug}`}
      className="group block"
      aria-label={`${car.make} ${car.model} — ${subtitle}`}
    >
      <div className="overflow-hidden">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={`${car.make} ${car.model} — ${car.color_label}`}
            width={1600}
            height={1067}
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            className="block h-auto w-full transition-opacity duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-90"
          />
        ) : (
          <div className="relative aspect-[4/5] bg-graphite">
            <span className="absolute bottom-6 left-6 select-none font-display text-5xl leading-none text-white/[0.06]">
              {car.make.split("-")[0]}
            </span>
            <div className="from-graphite/60 absolute inset-0 bg-gradient-to-t via-transparent to-transparent transition-opacity duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-80" />
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-ink/55 text-[10px] uppercase tracking-[0.22em]">{car.make}</p>
        <p className="mt-2 font-display text-2xl leading-tight">{car.model}</p>
        <p className="text-ink/50 mt-1 text-[10px] uppercase tracking-[0.18em]">{subtitle}</p>
      </div>
    </Link>
  );
}
