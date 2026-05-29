// Homepage preview: first 3 from the real inventory.
// Vendor/source fields (_source) are never present in components that consume this.
import { residences } from "@/data/inventory/residences";

export const RESIDENCES_PREVIEW = residences.slice(0, 3);
