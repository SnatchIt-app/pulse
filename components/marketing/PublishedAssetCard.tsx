import Link from "next/link";
import type { PublishedAsset, PublishedServiceType } from "@/lib/inventory/published-assets";
import InventoryCardMedia from "./InventoryCardMedia";

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
 * Public card for a CRM-published asset. Image strategy is now delegated to
 * the shared `InventoryCardMedia` so this card lines up to the same grid as
 * CarCard / JetCard / YachtCard / ResidenceCard regardless of the uploaded
 * photo's natural aspect ratio. Three-line text layout matches the flat-file
 * cards.
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
      <InventoryCardMedia src={asset.cover_image} alt={asset.name} aspect={asset.service_type} />
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
