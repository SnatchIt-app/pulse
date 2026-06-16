import Image from "next/image";

export type InventoryCardAspect = "car" | "jet" | "yacht" | "residence";

// Single source of truth for inventory card image proportions. Every fleet,
// jet, yacht, residence and CRM-published asset card renders through this so
// neighboring cards line up to a fixed grid regardless of the source photo's
// natural aspect ratio. Cars / jets / yachts share one ratio; residences keep
// their own slightly more editorial proportion.
const ASPECT_CLASS: Record<InventoryCardAspect, string> = {
  car: "aspect-[4/3]",
  jet: "aspect-[4/3]",
  yacht: "aspect-[4/3]",
  residence: "aspect-[4/3]",
};

// Fallback (no image) background tone per service type. Cars / jets / yachts
// stay on graphite to match the dark fleet language; residences sit on bone to
// match the warmer Pulse Residences treatment.
const FALLBACK_BG: Record<InventoryCardAspect, string> = {
  car: "bg-graphite",
  jet: "bg-graphite",
  yacht: "bg-graphite",
  residence: "bg-bone",
};

const FALLBACK_GRADIENT_FROM: Record<InventoryCardAspect, string> = {
  car: "from-graphite/60",
  jet: "from-graphite/60",
  yacht: "from-graphite/60",
  residence: "from-bone/60",
};

/**
 * Fixed-aspect media wrapper for inventory cards. Strategy:
 *   `relative aspect-[X/Y] overflow-hidden` container
 * + `<Image fill className="object-cover">`
 * so the source photo is center-cropped into a uniform box and no card grows
 * taller than its neighbor. Intrinsic-height rendering (`h-auto w-full` on
 * `<Image>`) is forbidden here — it's the exact pattern that caused fleet
 * cards to mismatch in height.
 *
 * No internal notes, vendor, source, or status data ever touches this layer.
 */
export default function InventoryCardMedia({
  src,
  alt,
  aspect,
  fallbackWatermark,
}: {
  src: string | null;
  alt: string;
  aspect: InventoryCardAspect;
  fallbackWatermark?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${ASPECT_CLASS[aspect]} ${FALLBACK_BG[aspect]}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover transition-opacity duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-90"
        />
      ) : (
        <>
          {fallbackWatermark ? (
            <span className="absolute bottom-6 left-6 select-none font-display text-5xl leading-none text-white/[0.06]">
              {fallbackWatermark}
            </span>
          ) : null}
          <div
            className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent ${FALLBACK_GRADIENT_FROM[aspect]} transition-opacity duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-80`}
          />
        </>
      )}
    </div>
  );
}
