// Higgsfield-ready media specification.
// Each slot ships a placeholder SVG today + a prompt to generate the final asset.
//
// Global Higgsfield style (applied to every prompt):
//   cinematic editorial photograph · anamorphic 35mm · shallow depth of field ·
//   warm grade · 4k · ultra-detailed reflections · golden-hour Miami light
//
// Global negatives (never produce):
//   no people in frame · no on-screen text or logos · no neon · no lens flare ·
//   no motion blur clichés · no stock-photo composition

export type MediaSlot = {
  key: string;
  placeholder: string; // /placeholders/*.svg shipped in /public
  alt: string;
  prompt: string;
  aspect?: string; // "16/9" | "4/5" | "1/1" | "3/4"
};

export const HOMEPAGE_MEDIA = {
  hero: {
    key: "home-hero",
    placeholder: "/placeholders/hero.svg",
    alt: "A Pulse exotic car at dusk on a Miami waterfront drive.",
    prompt:
      "A jet-black Lamborghini Urus parked low on the MacArthur Causeway at dusk, Miami skyline far in background, Biscayne Bay reflections, dramatic side lighting, anamorphic 35mm, warm grade, ultra-detailed paint reflections, no people.",
    aspect: "16/9",
  },
  featured1: {
    key: "featured-lamborghini-urus",
    placeholder: "/placeholders/vehicle-1.svg",
    alt: "Lamborghini Urus in editorial studio framing.",
    prompt:
      "Lamborghini Urus in matte nero, three-quarter front, low angle, on polished concrete in an architectural Miami garage, soft top light, anamorphic 35mm, no people.",
    aspect: "4/5",
  },
  featured2: {
    key: "featured-ferrari-488-spider",
    placeholder: "/placeholders/vehicle-2.svg",
    alt: "Ferrari 488 Spider, profile, golden hour.",
    prompt:
      "Ferrari 488 Spider in rosso corsa, side profile, Star Island driveway at golden hour, palms in soft background bokeh, warm grade, anamorphic, no people.",
    aspect: "4/5",
  },
  featured3: {
    key: "featured-rolls-royce-cullinan",
    placeholder: "/placeholders/vehicle-3.svg",
    alt: "Rolls-Royce Cullinan, three-quarter rear.",
    prompt:
      "Rolls-Royce Cullinan in arctic white, three-quarter rear, in front of a modernist Brickell tower lobby, evening, cool tungsten lobby light, anamorphic, no people.",
    aspect: "4/5",
  },
  featured4: {
    key: "featured-mclaren-720s",
    placeholder: "/placeholders/vehicle-4.svg",
    alt: "McLaren 720S, low front three-quarter.",
    prompt:
      "McLaren 720S in papaya orange, low front three-quarter, on an empty South Beach side street at blue hour, anamorphic 35mm, no people.",
    aspect: "4/5",
  },
  editorial: {
    key: "editorial-bay-bridge",
    placeholder: "/placeholders/editorial.svg",
    alt: "Cinematic Miami causeway at night.",
    prompt:
      "Ultra-wide cinematic shot of an empty MacArthur Causeway at night, slick wet asphalt, distant skyline lights, anamorphic, deep moody warm grade, no people, no cars.",
    aspect: "16/10",
  },
  residence1: {
    key: "residence-star-island",
    placeholder: "/placeholders/residence-1.svg",
    alt: "Sunlit modern villa exterior with pool.",
    prompt:
      "A modernist Star Island villa exterior at golden hour, infinity pool, palms, soft directional light, warm editorial grade, no people, no signage.",
    aspect: "4/5",
  },
  residence2: {
    key: "residence-south-of-fifth",
    placeholder: "/placeholders/residence-2.svg",
    alt: "Editorial interior of a luxury Miami residence.",
    prompt:
      "Editorial living room of a Miami penthouse, floor-to-ceiling windows, view of Biscayne Bay, soft natural light, minimalist furniture, no people.",
    aspect: "4/5",
  },
  residence3: {
    key: "residence-coral-gables",
    placeholder: "/placeholders/residence-3.svg",
    alt: "Coral Gables modern home, soft daylight.",
    prompt:
      "Exterior of a contemporary Coral Gables home, tree-lined driveway, soft daylight, editorial composition, no people.",
    aspect: "4/5",
  },
} as const satisfies Record<string, MediaSlot>;

export type HomepageMediaKey = keyof typeof HOMEPAGE_MEDIA;
