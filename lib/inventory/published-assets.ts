import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

// Public projection of an asset. Internal-only columns are NEVER selected here:
//   description (internal notes), public_url internals, source_inventory_type,
//   source_slug, status, created_at — all stripped.
export type PublishedAsset = {
  id: string;
  slug: string;
  name: string;
  service_type: PublishedServiceType;
  cover_image: string | null;
  gallery: string[];
  public_description: string | null;
  public_featured: boolean;
  public_sort_order: number;
  source_slug: string | null; // used only for dedupe against flat-file inventory
};

export type PublishedServiceType = "car" | "jet" | "yacht" | "residence";

/**
 * Server-only fetcher. Uses the admin client because all Supabase reads in this
 * project run server-side; the key never reaches the browser. We return ONLY
 * public-safe columns and filter to `is_public = true`.
 *
 * If Supabase env vars aren't configured (preview/local), returns [] silently
 * so the flat-file inventory still renders.
 */
export async function getPublishedAssetsByService(
  serviceType: PublishedServiceType,
): Promise<PublishedAsset[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  ) {
    return [];
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("assets")
      .select(
        "id, slug, name, service_type, cover_image, gallery, public_description, public_featured, public_sort_order, source_slug",
      )
      .eq("is_public", true)
      .eq("service_type", serviceType)
      .neq("status", "inactive")
      .order("public_featured", { ascending: false })
      .order("public_sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error || !data) return [];

    return data
      .filter(
        (
          a,
        ): a is { slug: string } & Omit<PublishedAsset, "slug" | "service_type"> & {
            service_type: string;
          } => typeof a.slug === "string" && a.slug.length > 0,
      )
      .map((a) => ({
        id: String(a.id),
        slug: a.slug,
        name: a.name,
        service_type: serviceType,
        cover_image: a.cover_image ?? null,
        gallery: Array.isArray(a.gallery) ? (a.gallery as string[]) : [],
        public_description: a.public_description ?? null,
        public_featured: Boolean(a.public_featured),
        public_sort_order: typeof a.public_sort_order === "number" ? a.public_sort_order : 0,
        source_slug: a.source_slug ?? null,
      }));
  } catch {
    // Defensive: never crash a public page due to CRM/DB issues.
    return [];
  }
}

/**
 * Filter out any published asset whose source_slug matches an existing flat-file
 * item slug, so synced rows don't render twice alongside the flat-file inventory.
 */
export function dedupeAgainstFlatFile(
  published: PublishedAsset[],
  flatFileSlugs: ReadonlyArray<string>,
): PublishedAsset[] {
  const flat = new Set(flatFileSlugs);
  return published.filter((p) => !(p.source_slug && flat.has(p.source_slug)));
}
