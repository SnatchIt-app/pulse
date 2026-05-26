import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import ServicePageTemplate from "@/components/marketing/ServicePageTemplate";
import { SERVICE_CONTENT } from "@/data/service-content";
import { SERVICE_FAQS } from "@/data/faqs";

export const metadata: Metadata = buildMetadata({ route: "/jet-skis", path: "/jet-skis" });

export default function JetSkisPage() {
  return (
    <ServicePageTemplate content={SERVICE_CONTENT["jet-skis"]} faqs={SERVICE_FAQS["jet-skis"]} />
  );
}
