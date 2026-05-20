import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function getSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // called from a server component — safe to ignore
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // called from a server component — safe to ignore
          }
        },
      },
    },
  );
}

// PUBLIC residence projection. Excludes all vendor/internal columns:
// internal_source_name, internal_source_url, external_property_id,
// source_calendar_url, source_type, address_private, base_rate_internal,
// markup_type, markup_value.
export const PUBLIC_RESIDENCE_FIELDS = [
  "id",
  "slug",
  "title",
  "neighborhood",
  "public_location_label",
  "bedrooms",
  "bathrooms",
  "max_guests",
  "nightly_rate_from",
  "final_rate_display",
  "min_stay",
  "amenities",
  "description",
  "gallery",
  "hero_image_url",
  "status",
  "is_featured",
  "display_order",
].join(", ");

export async function getPublicResidence(slug: string) {
  const sb = await getSupabaseServer();
  const { data } = await sb
    .from("residences")
    .select(PUBLIC_RESIDENCE_FIELDS)
    .eq("slug", slug)
    .eq("status", "available")
    .maybeSingle();
  return data;
}

export async function getPublicResidences() {
  const sb = await getSupabaseServer();
  const { data } = await sb
    .from("residences")
    .select(PUBLIC_RESIDENCE_FIELDS)
    .eq("status", "available")
    .order("display_order", { ascending: true });
  return data ?? [];
}
