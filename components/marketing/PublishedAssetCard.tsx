import Image from "next/image";
import Link from "next/link";
import type { PublishedAsset, PublishedServiceType } from "@/lib/inventory/published-assets";

// Maps service_type → request-form param + display label.
const REQUEST_PARAM: Record<PublishedServiceType, string> = {
  car: "vehicle",
  jet: "jet",
  yacht: "yacht",
  residence: "residence",
};

const SERVICE_LABEL: Record<PublishedServiceType, string> = {
  car: "Exotic Car",
  jet: "Private Jet",
  yacht: "Yacht",
  residence: "Residence",
};

/**
 * Public card for a CRM-published asset. Image strategy matches CarCard /
 * ResidenceCard exactly: intrinsic-aspect via `width/height` hint + `h-auto
 * w-full` so the photo renders at its real aspect ratio (no crop, no forced
 * 4:5 / 3:2 mismatch). Three-line text layout matches the flat-file cards.
 *
 * No internal notes, vendor, source, or status data is ever rendered here.
 * Clicks through directly to the prefilled request form.
 */
export default function PublishedAssetCard({ asset }: { asset: PublishedAsset }) {
  const requestHref = `/request?service=${encodeURIComponent(asset.service_type)}&${REQUEST_PARAM[asset.service_type]}=${encodeURIComponent(asset.slug)}&title=${encodeURIComponent(asset.name)}`;

  const eyebrow = (asset.public_brand?.trim() || SERVICE_LABEL[asset.service_type]).toUpperCase();
  const details =
    (asset.public_details?.trim() ||
      asset.public_subtitle?.trim() ||
      asset.public_description?.trim()) ??
    "";

  return (
    <Link
      href={requestHref}
      className="group block"
      aria-label={`${asset.name} — request`}
      data-testid="published-asset-card"
    >
      <div className="overflow-hidden">
        {asset.cover_image ? (
          <Image
            src={asset.cover_image}
            alt={asset.name}
            width={1600}
            height={1067}
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            className="block h-auto w-full transition-opacity duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-90"
          />
        ) : (
          <div className="relative aspect-[3/2] bg-graphite">
            <div className="from-graphite/60 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-ink/55 text-[10px] uppercase tracking-[0.22em]">{eyebrow}</p>
        <p className="mt-2 font-display text-2xl leading-tight">{asset.name}</p>
        {details ? (
          <p className="text-ink/50 mt-1 text-[10px] uppercase tracking-[0.18em]">{details}</p>
        ) : null}
      </div>
    </Link>
  );
}
