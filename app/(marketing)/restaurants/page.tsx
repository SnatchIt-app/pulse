import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import ServicePageTemplate from "@/components/marketing/ServicePageTemplate";
import { SERVICE_CONTENT } from "@/data/service-content";
import { SERVICE_FAQS } from "@/data/faqs";

export const metadata: Metadata = buildMetadata({ route: "/restaurants", path: "/restaurants" });

export default function RestaurantsPage() {
  return (
    <ServicePageTemplate content={SERVICE_CONTENT.restaurants} faqs={SERVICE_FAQS.restaurants} />
  );
}
