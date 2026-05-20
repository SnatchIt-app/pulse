import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Supabase Storage remotePatterns added once project URL is set.
    remotePatterns: [],
  },
};

export default nextConfig;
