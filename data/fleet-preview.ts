import { cars } from "@/data/inventory/cars";

// Unique make+model pairs across the full inventory, in first-occurrence order.
// Auto-syncs with data/inventory/cars.ts — add a car there and it appears here.
export const FLEET_MARQUEE: ReadonlyArray<string> = Array.from(
  new Map(cars.map((c) => [`${c.make}-${c.model}`, `${c.make} ${c.model}`.toUpperCase()])).values(),
);
