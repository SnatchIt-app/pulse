import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import MotionFade from "@/components/shared/MotionFade";
import RequestForm from "@/components/marketing/RequestForm";

export const metadata: Metadata = buildMetadata({ route: "/request", path: "/request" });

type SearchParams = Promise<{
  vehicle?: string;
  yacht?: string;
  jet?: string;
  residence?: string;
  service?: string;
  experience?: string;
  title?: string;
  [key: string]: string | undefined;
}>;

/** "supercar-weekend" → "Supercar Weekend" */
function formatSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function RequestPage({ searchParams }: { searchParams: SearchParams }) {
  const { vehicle, yacht, jet, residence, service, experience, title } = await searchParams;

  const assetTitle = title ? decodeURIComponent(title) : undefined;

  // Standard asset flags
  const hasVehicle = Boolean(vehicle && assetTitle);
  const hasYacht = Boolean(yacht && assetTitle);
  const hasJet = Boolean(jet && assetTitle);
  const hasResidence = Boolean(residence && assetTitle);

  // Experience flag — either ?service=experience or ?experience=[slug] present
  const hasExperience = Boolean(
    experience && (service === "experience" || (!vehicle && !yacht && !jet && !residence)),
  );

  const hasAsset = hasVehicle || hasYacht || hasJet || hasResidence;

  const assetSlug = hasVehicle
    ? vehicle
    : hasYacht
      ? yacht
      : hasJet
        ? jet
        : hasResidence
          ? residence
          : null;

  const assetHref = hasVehicle
    ? `/fleet/${assetSlug}`
    : hasYacht
      ? `/yachts/${assetSlug}`
      : hasJet
        ? `/jets/${assetSlug}`
        : hasResidence
          ? `/residences/${assetSlug}`
          : null;

  const assetTypeLabel = hasVehicle
    ? "Vehicle"
    : hasYacht
      ? "Yacht"
      : hasJet
        ? "Jet"
        : hasResidence
          ? "Residence"
          : null;

  const experienceTitle = experience ? formatSlug(experience) : undefined;

  return (
    <Section className="bg-paper pb-32 pt-32">
      <Container>
        <MotionFade>
          <p className="text-ink/55 text-[11px] uppercase tracking-[0.24em]">
            {hasExperience
              ? "Experience Request"
              : hasAsset
                ? `${assetTypeLabel} Request`
                : "Request"}
          </p>

          <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[0.98] sm:text-6xl md:text-7xl">
            Tell us what you need.
          </h1>

          {/* Asset context chip */}
          {hasAsset && assetTitle && assetHref && assetTypeLabel && (
            <div className="border-ink/10 mt-8 inline-flex items-center gap-3 border bg-bone px-5 py-3">
              <span className="text-ink/40 text-[9px] uppercase tracking-[0.2em]">
                {assetTypeLabel}
              </span>
              <span className="font-display text-base">{assetTitle}</span>
              <Link
                href={assetHref}
                className="text-ink/35 ml-2 text-[9px] uppercase tracking-[0.18em] transition-colors hover:text-ink"
              >
                ← Change
              </Link>
            </div>
          )}

          {/* Experience context chip */}
          {hasExperience && experienceTitle && (
            <div className="border-ink/10 mt-8 inline-flex items-center gap-3 border bg-bone px-5 py-3">
              <span className="text-ink/40 text-[9px] uppercase tracking-[0.2em]">Experience</span>
              <span className="font-display text-base">{experienceTitle}</span>
              <Link
                href="/experiences"
                className="text-ink/35 ml-2 text-[9px] uppercase tracking-[0.18em] transition-colors hover:text-ink"
              >
                ← Change
              </Link>
            </div>
          )}

          <p className="text-ink/55 mt-6 max-w-xl text-sm leading-relaxed sm:text-base">
            {hasVehicle
              ? `A Pulse specialist will confirm availability for the ${assetTitle} and send a tailored quote within 15 minutes.`
              : hasYacht
                ? `A Pulse specialist will confirm availability for the ${assetTitle} and send a tailored charter quote within 15 minutes.`
                : hasJet
                  ? `A Pulse specialist will confirm availability for the ${assetTitle} and send a tailored charter quote within 15 minutes.`
                  : hasResidence
                    ? `A Pulse specialist will confirm availability for ${assetTitle} and arrange your stay within 15 minutes.`
                    : hasExperience
                      ? `A Pulse specialist will respond within 15 minutes with a tailored arrangement for your ${experienceTitle ?? "experience"}.`
                      : "A Pulse specialist responds within 15 minutes. Exotic cars, yachts, jets, residences — anything inside a Miami stay."}
          </p>

          <RequestForm
            vehicleSlug={vehicle}
            yachtSlug={yacht}
            jetSlug={jet}
            residenceSlug={residence}
            experienceSlug={hasExperience ? experience : undefined}
            assetTitle={hasExperience ? experienceTitle : assetTitle}
          />
        </MotionFade>
      </Container>
    </Section>
  );
}
