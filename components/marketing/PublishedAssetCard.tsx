import Image from "next/image";
import Link from "next/link";
import type { PublishedAsset, PublishedServiceType } from "@/lib/inventory/published-assets";

// Maps service_type → request-form param name + display label fallback.
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
 * Card for a CRM-published asset. Renders ONLY public-safe fields:
 *   public_brand (eyebrow, falls back to service label)
 *   name (headline)
 *   public_subtitle (secondary line)
 *   public_description (body)
 *
 * No internal notes, vendor, source, or status data is rendered.
 *
 * Click target: the public request form, prefilled with service + asset title.
 * Detail pages for CRM assets are intentionally not generated in this phase.
 */
export default function PublishedAssetCard({ asset }: { asset: PublishedAsset }) {
  const requestHref = `/request?service=${encodeURIComponent(asset.service_type)}&${REQUEST_PARAM[asset.service_type]}=${encodeURIComponent(asset.slug)}&title=${encodeURIComponent(asset.name)}`;

  const eyebrow = (asset.public_brand?.trim() || SERVICE_LABEL[asset.service_type]).toUpperCase();

  return (
    <Link
      href={requestHref}
      className="group block"
      aria-label={`${asset.name} — request`}
      data-testid="published-asset-card"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-bone">
        {asset.cover_image ? (
          <Image
            src={asset.cover_image}
            alt={asset.name}
            fill
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
        ) : (
          <div className="from-bone/60 h-full w-full bg-gradient-to-t via-transparent to-transparent" />
        )}
      </div>
      <div className="mt-4">
        <p className="text-ink/55 text-[10px] uppercase tracking-[0.22em]">{eyebrow}</p>
        <p className="mt-2 font-display text-2xl leading-tight">{asset.name}</p>
        {asset.public_subtitle ? (
          <p className="text-ink/55 mt-1 text-[12px] leading-snug">{asset.public_subtitle}</p>
        ) : null}
        {asset.public_description ? (
          <p className="text-ink/65 mt-2 text-sm leading-relaxed">{asset.public_description}</p>
        ) : null}
      </div>
    </Link>
  );
}
