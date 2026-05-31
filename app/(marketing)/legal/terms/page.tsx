import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service — Pulse",
  description: "Terms governing use of the Pulse website and services arranged through Pulse.",
  path: "/legal/terms",
});

const EFFECTIVE_DATE = "May 29, 2025";
const CONTACT_EMAIL = "pulsexotics@exoticsinfo.com";

export default function TermsPage() {
  return (
    <Section className="bg-paper pb-32 pt-32 md:pb-40 md:pt-40">
      <Container>
        <div className="max-w-2xl">
          <p className="text-ink/45 text-[10px] uppercase tracking-[0.24em]">Legal</p>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl">Terms of Service</h1>
          <p className="text-ink/50 mt-4 text-sm">Effective {EFFECTIVE_DATE}</p>

          <div className="mt-16 space-y-12 text-sm leading-relaxed">
            {/* 1 */}
            <div>
              <h2 className="font-display text-xl">1. Agreement to terms</h2>
              <p className="text-ink/70 mt-4">
                By accessing this website or submitting a service request through Pulse, you agree
                to be bound by these Terms of Service. If you do not agree, please do not use this
                site or our services.
              </p>
            </div>

            {/* 2 */}
            <div>
              <h2 className="font-display text-xl">2. Services</h2>
              <p className="text-ink/70 mt-4">
                Pulse provides access to luxury vehicles, private jet charters, yacht charters,
                luxury residences, and concierge services. Pulse acts as an arranger and concierge —
                some services are fulfilled directly by Pulse, and others are fulfilled by vetted
                independent operators on your behalf.
              </p>
              <p className="text-ink/70 mt-4">
                All services are available by request only. No service is confirmed until Pulse
                provides written confirmation of your booking.
              </p>
            </div>

            {/* 3 */}
            <div>
              <h2 className="font-display text-xl">3. Quote-only pricing</h2>
              <p className="text-ink/70 mt-4">
                All rates presented on this site are indicative only. Final pricing is determined
                individually based on availability, dates, duration, group size, and specific
                requirements. Submitting a request does not constitute a booking, guarantee
                availability, or lock in any rate.
              </p>
            </div>

            {/* 4 */}
            <div>
              <h2 className="font-display text-xl">4. Eligibility</h2>
              <p className="text-ink/70 mt-4">
                You must be at least 18 years of age to use this site. Vehicle rental requires a
                minimum age of 25 years and a valid driver&apos;s license. Specific eligibility
                requirements vary by vehicle and jurisdiction and will be communicated prior to
                confirmation.
              </p>
            </div>

            {/* 5 */}
            <div>
              <h2 className="font-display text-xl">5. Partner operators</h2>
              <p className="text-ink/70 mt-4">
                Jet charters, yacht charters, residences, restaurant reservations, and other
                concierge services may be fulfilled by independent independent operators. Pulse
                curates and vets these operators but does not own or directly operate all assets.
                The terms and conditions of those operators govern the specific service arrangement,
                and Pulse is not liable for the acts or omissions of independent operators.
              </p>
            </div>

            {/* 6 */}
            <div>
              <h2 className="font-display text-xl">6. Cancellations and refunds</h2>
              <p className="text-ink/70 mt-4">
                Cancellation and refund policies are specific to each service and will be
                communicated to you in writing at the time your booking is confirmed. No refund or
                cancellation policy is implied by these general terms.
              </p>
            </div>

            {/* 7 */}
            <div>
              <h2 className="font-display text-xl">7. Limitation of liability</h2>
              <p className="text-ink/70 mt-4">
                To the maximum extent permitted by applicable law, Pulse&apos;s total liability for
                any claim arising out of or relating to these terms or the use of our services shall
                not exceed the total amount paid by you for the specific service giving rise to the
                claim.
              </p>
              <p className="text-ink/70 mt-4">
                Pulse is not liable for any indirect, incidental, special, or consequential damages,
                including loss of use, loss of profits, or personal injury arising from services
                arranged through this site.
              </p>
            </div>

            {/* 8 */}
            <div>
              <h2 className="font-display text-xl">8. Intellectual property</h2>
              <p className="text-ink/70 mt-4">
                All content on this site — including text, imagery, logos, and design — is owned by
                or licensed to Pulse and may not be reproduced, distributed, or used without prior
                written permission.
              </p>
            </div>

            {/* 9 */}
            <div>
              <h2 className="font-display text-xl">9. Governing law</h2>
              <p className="text-ink/70 mt-4">
                These terms are governed by the laws of the State of Florida, without regard to
                conflict of law principles. Any disputes shall be resolved exclusively in the courts
                of Miami-Dade County, Florida.
              </p>
            </div>

            {/* 10 */}
            <div>
              <h2 className="font-display text-xl">10. Changes to these terms</h2>
              <p className="text-ink/70 mt-4">
                Pulse reserves the right to modify these terms at any time. Updated terms will be
                posted to this page with a revised effective date. Continued use of the site
                following changes constitutes acceptance of the revised terms.
              </p>
            </div>

            {/* Contact */}
            <div className="border-ink/10 border-t pt-10">
              <h2 className="font-display text-xl">Questions</h2>
              <p className="text-ink/70 mt-4">For questions about these terms, contact us at:</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-2 block text-ink transition-opacity hover:opacity-60"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
