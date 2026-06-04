import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aihgejwdvkvngjwttxij.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      // Yacht slug cleanup — old internal-reference slugs → clean editorial slugs (permanent).
      {
        source: "/yachts/ferretti-780-hsy",
        destination: "/yachts/ferretti-780",
        permanent: true,
      },
      {
        source: "/yachts/azimut-72-mancusa",
        destination: "/yachts/azimut-72",
        permanent: true,
      },
      {
        source: "/yachts/princess-88-praying-for-overtime",
        destination: "/yachts/princess-88",
        permanent: true,
      },
      {
        source: "/yachts/sunseeker-92-rmm-job",
        destination: "/yachts/sunseeker-92",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
