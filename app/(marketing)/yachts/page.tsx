import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import ServicePageTemplate from "@/components/marketing/ServicePageTemplate";
import { SERVICE_CONTENT } from "@/data/service-content";
import { SERVICE_FAQS } from "@/data/faqs";

export const metadata: Metadata = buildMetadata({ route: "/yachts", path: "/yachts" });

export default function YachtsPage() {
  return <ServicePageTemplate content={SERVICE_CONTENT.yachts} faqs={SERVICE_FAQS.yachts} />;
}
