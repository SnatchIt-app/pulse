import type { Jet } from "@/types/inventory";

export const jets: Jet[] = [
  {
    slug: "citation-650",
    name: "Citation 650",
    category: "Midsize Jet",
    capacity: 8,
    quote_only: true,
    images: ["/jets/citation-650/cover.jpg"],
  },
  {
    slug: "gulfstream-g4",
    name: "Gulfstream G4",
    category: "Heavy Jet",
    capacity: 12,
    quote_only: true,
    images: ["/jets/gulfstream-g4/cover.jpg"],
  },
  {
    slug: "hawker-800xp",
    name: "Hawker 800XP",
    category: "Midsize Jet",
    capacity: 8,
    quote_only: true,
    images: ["/jets/hawker-800xp/cover.jpg"],
  },
];
