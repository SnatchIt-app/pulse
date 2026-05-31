import "server-only";
import { Resend } from "resend";
import { SITE_URL } from "./utils";

// Human-readable labels for service_type enum values
const SERVICE_LABELS: Record<string, string> = {
  car: "Exotic Car",
  yacht: "Yacht Charter",
  jet: "Private Jet",
  jet_ski: "Jet Skis",
  chauffeur: "Chauffeur",
  restaurant: "Dining & Reservations",
  nightlife: "Nightlife",
  concierge: "Concierge",
  residence: "Residence",
  experience: "Experience",
  other: "Other",
};

type LeadNotifyParams = {
  fullName: string;
  phone?: string;
  email: string;
  serviceType: string;
  message: string | null;
};

/**
 * Sends a lead notification email via Resend.
 * Never throws — all errors are logged and swallowed so the caller is never blocked.
 *
 * Required env vars:
 *   RESEND_API_KEY      — Resend API key
 *   LEAD_NOTIFY_EMAIL   — recipient address for notifications
 *
 * Optional env vars:
 *   RESEND_FROM_EMAIL   — verified sender (e.g. "Pulse <notifications@yourdomain.com>")
 *                         Defaults to onboarding@resend.dev (works for Resend account owner only)
 */
export async function sendLeadNotification(params: LeadNotifyParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const notifyEmail = process.env.LEAD_NOTIFY_EMAIL?.trim();

  if (!apiKey || !notifyEmail) {
    console.warn(
      `[email] Notification skipped — missing: ${[
        !apiKey && "RESEND_API_KEY",
        !notifyEmail && "LEAD_NOTIFY_EMAIL",
      ]
        .filter(Boolean)
        .join(", ")}`,
    );
    return;
  }

  const serviceLabel = SERVICE_LABELS[params.serviceType] ?? params.serviceType;
  const from = process.env.RESEND_FROM_EMAIL?.trim() ?? "Pulse <onboarding@resend.dev>";
  const adminUrl = `${SITE_URL}/admin/leads`;

  const text = [
    `New Pulse lead — ${serviceLabel}`,
    "",
    `Name:    ${params.fullName}`,
    `Phone:   ${params.phone?.trim() || "—"}`,
    `Email:   ${params.email}`,
    `Service: ${serviceLabel}`,
    "",
    "Message:",
    params.message?.trim() || "—",
    "",
    `Admin: ${adminUrl}`,
  ].join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: notifyEmail,
      subject: `New Pulse Lead — ${serviceLabel}`,
      text,
    });

    if (error) {
      console.error(
        "[email] Resend error:",
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : JSON.stringify(error),
      );
    } else {
      console.log(`[email] Lead notification sent to ${notifyEmail}`);
    }
  } catch (err) {
    console.error("[email] Unexpected send error:", err);
  }
}
