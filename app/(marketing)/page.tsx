import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Hero from "@/components/marketing/Hero";
import Marquee from "@/components/marketing/Marquee";
import FeaturedFleet from "@/components/marketing/FeaturedFleet";
import ServiceRail from "@/components/marketing/ServiceRail";
import TrustPillars from "@/components/marketing/TrustPillars";
import EditorialBlock from "@/components/marketing/EditorialBlock";
import ResidencesPreview from "@/components/marketing/ResidencesPreview";
import ConciergeCTA from "@/components/marketing/ConciergeCTA";

export const metadata: Metadata = buildMetadata({ route: "/", path: "/" });

// Order: cars primary (Hero → Marquee → FeaturedFleet), then services,
// trust, editorial moment, residences secondary, concierge close.
export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <FeaturedFleet />
      <ServiceRail />
      <TrustPillars />
      <EditorialBlock />
      <ResidencesPreview />
      <ConciergeCTA />
    </>
  );
}
