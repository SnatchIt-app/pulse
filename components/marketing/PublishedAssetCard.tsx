import Image from "next/image";
import Link from "next/link";
import type { PublishedAsset, PublishedServiceType } from "@/lib/inventory/published-assets";

// Maps service_type → request-form param + display label + image aspect.
// Aspect ratio matches the existing typed cards so a CRM-published asset
// visually blends into the listing alongside CarCard / JetCard / etc.
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

const ASPECT: Record<PublishedServiceType, string> = {
  car: "aspect-[4/5]",
  jet: "aspect-[4/5]",
  yacht: "aspect-[4/5]",
  residence: "aspect-[3/2]",
};

/**
 * Public card for a CRM-published asset. Three-line layout that matches the
 * existing flat-file cards (CarCard / JetCard / YachtCard / ResidenceCard):
 *
 *   eyebrow — public_brand (uppercase, tracked); falls back to service label.
 *   name    — asset.name in display serif, 2xl.
 *   details — public_details (preferred) or legacy subtitle/description, in
 *             the same all-caps tracked treatment used by CarCard's subtitle.
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
      <div className={`relative ${ASPECT[asset.service_type]} overflow-hidden bg-graphite`}>
        {asset.cover_image ? (
          <Image
            src={asset.cover_image}
            alt={asset.name}
            fill
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            className="object-cover transition-opacity duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-90"
          />
        ) : (
          <div className="from-graphite/60 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
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
