import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pulse",
    short_name: "Pulse",
    description: "Luxury mobility & concierge.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f2ec",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: "/logo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
